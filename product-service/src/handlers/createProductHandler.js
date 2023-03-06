'use strict';
const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const putData = async (tableName, item) => {
  try {
    await db.put({
      TableName: tableName,
      Item: item,
    }).promise();
  } catch (error) {
      throw new Error(error);
  }
};

module.exports.createProduct = async (event) => {
  try {
    console.log(event);

    if(!event.body) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: `Product data is invalid` })
      }
    }

    const { count, price, title, description } = JSON.parse(event.body);
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

    await putData(productTable, productsTableItem);
    await putData(stocksTable, stocksTableItem);

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