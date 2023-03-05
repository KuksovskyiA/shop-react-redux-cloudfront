'use strict';
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB;
const TableName = process.env.TABLE_PRODUCTS

module.exports.createProduct = async (event) => {
  try {
    console.log(event);
    // const { item } = event.body;
    const item = {
        'id' : {N: '7'},
        'title' : {S: 'test'},
        'description':  {S: 'test'},
        'price': {N: '7'}
    };

    if(!item) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: `Product not found` })
        }
    }

    const createdProduct = await db.putItem({
      TableName,
      Item: item,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(createdProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
};