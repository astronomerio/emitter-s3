# emitter-s3

Wrapper for the AWS.S3 client that will emit an array or stream of JSON object to an s3 file.

## Creating an Emitter

Import the S3Emitter from 'emitter-s3' and pass in an options object to the constructor.

```javascript
const S3Emitter = require('emitter-s3');

const options = {
    filePath: 'my/file/path',
    bucketName: 'my_bucket',
    region: 'us-east-1',
    awsAccessKeyId: 'accessKeyId',
    awsSecretAccessKey: 'secretAccessKey'
};

const emitter = new S3Emitter(options);
```

## Options

### filePath (optional)

The file path at which your s3 files will be stored.

### appendTimestampToFilename

Default: true

By default, this will make the filename an ISO formatted date string. You can use filePath to create a path prefix with the filename as the timestamp.

### bucketName

The name of your S3 bucket.

### region

The region in which your S3 bucket is.

### serverSideEncryption (optional)

AWS S3 supports [server side encryption](http://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html). If your bucket policy requires the server side encryption header to be set, you can specify that here.

Possible values are 'AES256' or 'aws:kms'.

## API

### .emit(records)

Emits the data to an s3 file. Returns a promise.

```javascript
await emitter.emit(data);

// or with promises
emitter.emit(data).then(function () {
    // do something after uploading file
});
```

## License

Released under the MIT License.
