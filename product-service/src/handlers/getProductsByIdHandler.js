'use strict';
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient();
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const joinedProductData = async (productId) => {
  try {
    const product = await db.get({
      TableName: productTable,
      Key: {
        'id': productId
      },
    }).promise();

    const stockProductData = await db.get({
      TableName: stocksTable,
      Key: {
        'product_id': productId
      },
    }).promise();

    product.Item.count = stockProductData.Item.count;
    return product.Item;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProductsById = async (event) => {
  try {
    console.log(event);

    const { productId } = event.pathParameters;
    const product = await joinedProductData(productId);

    if(!product) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: `Product '${productId}' not found` })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify({ message: error.message || 'Something went wrong !!!' })
    }
  }
};
