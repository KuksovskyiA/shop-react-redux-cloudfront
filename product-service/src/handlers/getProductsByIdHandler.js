'use strict';
const { DynamoDB } = require("aws-sdk");

const db = new DynamoDB.DocumentClient();
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const joinedProductData = async (productId) => {
  try {
    const [product, stockProductData] = await Promise.all([
      db.get({
        TableName: productTable,
        Key: {
          'id': productId
        },
      }).promise(),
      db.get({
        TableName: stocksTable,
        Key: {
          'product_id': productId
        },
      }).promise()
    ]);

    if (!product?.Item || !stockProductData?.Item) {
      return null;
    }

    return {
      ...product?.Item,
      count: stockProductData?.Item?.count,
    };
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
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify({ message: error.message || 'Something went wrong !!!' })
    };
  }
};
