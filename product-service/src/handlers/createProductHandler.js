'use strict';
const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

module.exports.createProduct = async (event) => {
  try {
    console.log(event);
    const { count, price, title, description } = event.body;
    const getGUID = AWS.util.uuid.v4();
    const productsTableItem = {
        id : getGUID,
        title,
        description,
        price
    };

    const stocksTableItem = {
      product_id: getGUID,
      count
    }

    if(!productsTableItem) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: `Product not valid` })
        }
    }

    await db.put({
      TableName: productTable,
      Item: productsTableItem,
    }).promise();

    await db.put({
      TableName: stocksTable,
      Item: stocksTableItem,
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