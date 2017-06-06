const AWS = require('aws-sdk');
const promisify = require('util').promisify;
const _ = require('highland');
const { PassThrough } = require('stream');
const path = require('path');
const createAwsParams = require('./util/createAwsParams');

class S3Emitter {
  constructor(options) {
    this.options = options;

    const awsParams = createAwsParams(options);
    this.client = this.createClient(awsParams);
  }

  createClient(params) {
    const client = new AWS.S3(params);
    return client;
  }

  /**
   * Appends a timestamp to the end of an S3 path so the filename ends up being a timestamp.
   * @param {String} file path to which to append the timestamp
   * @returns {String} mutated filepath with timestamp appended to end
   */

  appendTimestampToFilePath(filePath) {
    if (this.options.appendTimestampToFilename === true) {
      const filename = (new Date()).toISOString();
      return path.join(filePath, filename);
    }

    return filePath;
  }

  /**
   * Will trim the first character of a filePath if it is a '/'. This causes an issue with finding your files in S3.
   * @param {String} file path to trim
   * @returns {String} mutated file path with a leading '/' removed
   */

  trimFilePath(filePath) {
    // we need to trim the first character if it is a /
    if (this.options.filePath.charAt(0) === '/') {
      return filePath.substring(1);
    }

    return filePath;
  }

  /**
   * Takes the file path from options passed in the constructor and appends a timestamp as the filename.
   * @returns {String} filePath The filePath that will where the file lives in S3.
   */

  getS3FilePath() {
    const filePath = this.options.filePath;
    const appended = this.appendTimestampToFilePath(filePath);
    const trimmed = this.trimFilePath(appended);
    return trimmed;
  }

  /**
   * Wraps the records in a highland stream and seperates by newline so we can stream to S3 a document of newline delimited JSON objects.
   * @param {Array} records The array of JSON objects to be put to S3.
   */

  getUploadBody(records) {
    return _(records).map(JSON.stringify).intersperse('\n');
  }

  async emit(records) {
    const filePath = this.getS3FilePath();
    const uploadBody = this.getUploadBody(records);
    await this.uploadRecords(filePath, uploadBody);
  }

  async uploadRecords(filePath, uploadBody) {
    const upload = promisify(this.client.upload).bind(this.client);
    await upload({ Key: filePath, Body: uploadBody.pipe(new PassThrough()) });
  }
}

module.exports = S3Emitter;
