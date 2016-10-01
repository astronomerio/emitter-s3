[![CircleCI](https://circleci.com/gh/astronomerio/emitter-s3.svg?style=svg)](https://circleci.com/gh/astronomerio/emitter-s3)

# emitter-s3

Wrapper for the AWS.S3 client that will emit an array or stream of JSON object to an s3 file.

## Creating an Emitter

Import the S3Emitter from 'emitter-s3' and pass in an options object to the constructor.

```javascript
import S3Emitter from 'emitter-s3';

const options = { 
    filePath: 'my/file/path',
    bucketName: 'my_bucket',
    region: 'us-east-1',
    awsAccessKeyId: 'accessKeyId',
    awsSecretAccessKey: 'secretAccessKey'
};

const emitter = new S3Emitter(options);
```

## API

### .emit(records)

Emits the data to an s3 file. Returns a promise.

```javascript
// using babel
await emitter.emit(data);

// or with promises
emitter.emit(data).then(function () {
    // do something after uploading file
});
```

## License

Released under the MIT License.
