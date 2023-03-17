'use strict';

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: 'eu-west-1' });

module.exports.handler = async (event) => {
    const { name } = event.queryStringParameters;
    const params = {
        Bucket: 'uploaded-data-bucket',
        Key: `uploaded/${name}`,
    };
    try {
      const command = new PutObjectCommand(params);
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