'use strict';
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_PRODUCTS

module.exports.createProduct = async (event) => {
  try {
    console.log(event);
    // const { item } = event.body;
    const item = {
        id : '7567ec4b-b10c-48c5-9345-fc73c48a80a9',
        title : 'ProductSeven',
        description: 'Short Product Description7',
        price: 30
    };

    if(!item) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: `Product not valid` })
        }
    }

    await db.put({
      TableName,
      Item: item,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product successfully created." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
};