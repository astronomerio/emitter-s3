/**
 * Takes the options passed into the constructor and transforms them into a format the aws sdk expects.
 * @param {Obj} options JSON object containing options for the aws sdk.
 */

export default function createAWSParams(options) {
    const { region, bucketName, awsAccessKeyId, awsSecretAccessKey } = options;
    const awsParams = { 
        params: { } 
    };

    awsParams.region = region;
    awsParams.accessKeyId = awsAccessKeyId;
    awsParams.secretAccessKey = awsSecretAccessKey;
    awsParams.params.Bucket = bucketName;

    return awsParams;
};
