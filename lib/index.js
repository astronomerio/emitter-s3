import logger from './util/logger';
import AWS from 'aws-sdk';
import thenify from 'thenify';
import _ from 'highland';
import { PassThrough  } from 'stream';
import path from 'path';
import createAwsParams from './util/createAwsParams';

export default class {
    constructor(options) {
        const { filePath, appendTimestampToFilename } = options;
        this.filePath = filePath || '';
        this.appendTimestampToFilename = appendTimestampToFilename === false ? false : true;

        const awsParams = createAwsParams(options);
        this.client = this.createClient(awsParams);
    }

    createClient(params) {
        const client = new AWS.S3(params);
        return client;
    }

    /**
     * Takes the file path from options passed in the constructor and appends a timestamp as the filename.
     * @returns {String} filePath The filePath that will where the file lives in S3.
     */

    getS3FilePath() {
        if (this.appendTimestampToFilename) {
            const filename = (new Date()).toISOString();
            const filePath = path.join(this.filePath, filename);
            return filePath;
        }

        return this.filePath;
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

        logger.info(`uploading file ${filePath} to s3`);
        await this.uploadRecords(filePath, uploadBody);
        logger.info(`successfully uploaded ${filePath} to s3`);
    }

    async uploadRecords(filePath, uploadBody) {
        const upload = thenify(this.client.upload).bind(this.client);
        await upload({ Key: filePath, Body: uploadBody.pipe(new PassThrough()) });
    }
};
