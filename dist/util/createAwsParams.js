"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createAWSParams;
/**
 * Takes the options passed into the constructor and transforms them into a format the aws sdk expects.
 * @param {Obj} options JSON object containing options for the aws sdk.
 */

function createAWSParams(options) {
    var region = options.region;
    var bucketName = options.bucketName;
    var awsAccessKeyId = options.awsAccessKeyId;
    var awsSecretAccessKey = options.awsSecretAccessKey;

    var awsParams = {
        params: {}
    };

    awsParams.region = region;
    awsParams.accessKeyId = awsAccessKeyId;
    awsParams.secretAccessKey = awsSecretAccessKey;
    awsParams.params.Bucket = bucketName;

    return awsParams;
};