/**
 * Takes the options passed into the constructor and transforms them into a format the aws sdk expects.
 * @param {Obj} options JSON object containing options for the aws sdk.
 */

function createAWSParams(options) {
    const { region, bucketName, awsAccessKeyId, awsSecretAccessKey, serverSideEncryption, acl } = options;
    const awsParams = { 
        params: { } 
    };

    awsParams.region = region;
    awsParams.accessKeyId = awsAccessKeyId;
    awsParams.secretAccessKey = awsSecretAccessKey;
    awsParams.params.Bucket = bucketName;
    if (serverSideEncryption) {
        awsParams.params.ServerSideEncryption = serverSideEncryption;
    }

    if (acl) {
        awsParams.params.ACL = acl;
    }

    return awsParams;
};

module.exports = createAWSParams;
