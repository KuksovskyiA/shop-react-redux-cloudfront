'use strict';
const AWS = require('aws-sdk');
const csv = require('csv-parser');

const s3 = new AWS.S3({ region: 'eu-west-1' });
const BUCKET = 'uploaded-data-bucket';
const results = [];

module.exports.handler = async (event) => {
    const params = {
        Bucket: BUCKET,
        Key: event.Records[0],
    };
    try {
        const csvFile = s3.getObject(params).createReadStream();
        csvFile
            .pipe(csv())
            .on('data', (data) => {
                console.log(data);
                results.push(data);
            })
            .on('error', () => {
                return {
                  statusCode: 400,
                  body: JSON.stringify({ message: `Invalid Request!` })
                };
            })
            .on('end', () => {
                console.log(results);
                return {
                  statusCode: 202,
                  body: JSON.stringify({ message: `Successfully read and parsed!` })
                };
            });
    } catch (error) {
        console.error('Error while downloading object from S3', error.message)
        throw error
    }
}

