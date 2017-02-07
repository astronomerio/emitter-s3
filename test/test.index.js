import S3Emitter from '../lib';
import createAwsParams from '../lib/util/createAwsParams';
import { assert } from 'chai';
import sinon from 'sinon';
import _ from 'highland';

describe('S3 Emitter', function () {
  let emitter;
  const accessKeyId = 'access_key';
  const secretAccessKey = 'secret_key';
  const serverSideEncryption = 'AES256';
  const bucketName = 'bucket_name';
  const acl = 'bucket-owner-full-control';
  const options = {
    filePath: 'my/file/path',
    appendTimestampToFilename: false,
    bucketName: bucketName,
    region: 'us-east-1',
    awsAccessKeyId: accessKeyId,
    awsSecretAccessKey: secretAccessKey,
    serverSideEncryption: serverSideEncryption,
    acl: acl
  };
  const records = [{ foo: 'bar' }, { hello: 'world' }];

  beforeEach(function () {
    emitter = new S3Emitter(options);
  });

  describe('createAwsParams', function () {
    it('should create the correct params', function () {
      const expectedParams = {
        region: 'us-east-1',
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        params: {
          Bucket: bucketName,
          ServerSideEncryption: serverSideEncryption,
          ACL: acl
        }
      };

      const params = createAwsParams(options);
      assert.deepEqual(params, expectedParams);
    });

    it('should create the correct params when serverSideEncryption and acl do not exist', function () {
      const expectedParams = {
        region: 'us-east-1',
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        params: {
          Bucket: bucketName
        }
      };

      const params = createAwsParams({ ...options, serverSideEncryption: null, acl: null });
      assert.deepEqual(params, expectedParams);
    });
  });

  describe('S3 Emitter', function () {
    it('should have the right settings', function () {
      // just make sure the emitter is saving the file path and creating a client
      assert.equal(emitter.options.filePath, options.filePath);
      assert.equal(emitter.options.appendTimestampToFilename, options.appendTimestampToFilename);
      assert.ok(emitter.client);
    });

    describe('#getUploadBody', function () {
      it('should wrap records in a highland stream and be separated by newline characters', function (done) {
        const expectedRecords = records.map(JSON.stringify).join('\n');

        const uploadBody = emitter.getUploadBody(records);
        uploadBody.toArray(function (array) {
          const joined = array.join('');
          assert.equal(expectedRecords, joined);
          done();
        });
      });
    });

    describe('#getS3FilePath', function () {
      it('should return the correct path with a timestamp appended when the option is true', function () {
        emitter = new S3Emitter({ ...options, appendTimestampToFilename: true });
        const filePath = emitter.getS3FilePath();

        // will make sure the filePath starts with the same filePath as specified in options
        const start = /^my\/file\/path\//.test(filePath);
        assert.ok(start);

        // tests if the file ends at just the file path from options. This should be false because there should be a timestamp appended
        const end = /^my\/file\/path\/$/.test(filePath);
        assert.isFalse(end);
      });

      it('should return the correct path with a timestamp appended when the option is false', function () {
        const filePath = emitter.getS3FilePath();

        // will make sure the filePath is the same filePath as specified in options
        const start = /^my\/file\/path$/.test(filePath);
        assert.ok(start);
      });

      it('should return the correct path when there is a leading /', function () {
        emitter.options.filePath = 'my/file/path';
        const filePath = emitter.getS3FilePath();

        // will make sure the filePath is the same filePath as specified in options
        const start = /^my\/file\/path$/.test(filePath);
        assert.ok(start);
      });
    });

    describe('#emit', function () {
      it('should call uploadBody with correct params', function (done) {
        const filePathStub = sinon.stub(emitter, 'getS3FilePath').returns('filePath');
        const getUploadBodyStub = sinon.stub(emitter, 'getUploadBody').returns('uploadBody');
        const uploadStub = sinon.stub(emitter, 'uploadRecords');

        emitter.emit('hello').then(() => {
          assert.ok(filePathStub.called);
          assert.ok(getUploadBodyStub.called);
          assert.ok(uploadStub.calledWith('filePath', 'uploadBody'));
          done();
        });
      });
    });

    // You can use this test with actual aws credentials passed into options to test it actually getting put to a bucket
    // describe('upload', function () {
    //     it('should upload to s3', async function () {
    //         const uploadBody = _(records).map(JSON.stringify).intersperse('\n');
    //         await emitter.uploadRecords('astronomer/test/file/here', uploadBody);
    //     });
    // });
  });
});
