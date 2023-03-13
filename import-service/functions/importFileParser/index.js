'use strict';
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require('csv-parser');

const s3 = new S3Client({ region: 'eu-west-1' });
const BUCKET = 'uploaded-data-bucket';

// const copyObject = async (params) => {
//     const { Bucket, Key } = params;
//     const command = new CopyObjectCommand({
//         Bucket,
//         CopySource: `${Bucket}/${Key}`,
//         Key: Key.replace('uploaded', 'parsed')
//     });
//     try {
//         const response = await s3.send(command);
//         console.log('Successfully copied!', response);
//     } catch (err) {
//         console.error(err);
//     }
// };

// const deleteObject = async (params) => {
//     const command = new DeleteObjectCommand(params);
//     try {
//         const response = await s3.send(command);
//         console.log('Successfully deleted!', response);
//     } catch (err) {
//         console.error(err);
//     }
// };

module.exports.handler = async (event) => {
    const params = {
        Bucket: BUCKET,
        Key: event?.Records[0]?.s3?.object?.key,
    };
    const results = [];
    try {
        const command = new GetObjectCommand(params);
        const s3Stream = await s3.send(command);

        s3Stream.Body
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
            .on('end', async () => {
                console.log('Successfully parsed!', results);
                return {
                  statusCode: 202,
                  body: JSON.stringify({ message: `Successfully parsed!` })
                };
            });
    } catch (error) {
        return {
            statusCode: 500,
            body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
        };
    }
}

