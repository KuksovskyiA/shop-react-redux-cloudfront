'use strict';

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: 'eu-west-1' });
const BUCKET = 'uploaded-data-bucket';

module.exports.handler = async (event) => {
    const { name } = event.queryStringParameters;
    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${name}`,
    };
    try {
      const command = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(s3, command);
      return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify(signedUrl)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
      };
    }
  };