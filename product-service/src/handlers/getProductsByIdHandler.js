'use strict';
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB;
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const joinedProducts = async (productId) => {
  try {
    const product = await db.getItem({
      TableName: productTable,
      Key: {
        'id': {N: productId}
      },
    }).promise();

    const stockProduct = await db.getItem({
      TableName: stocksTable,
      Key: {
        'product_id': {N: productId}
      },
    }).promise();

    product.Item.count = stockProduct.Item.count;
    return product;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getProductsById = async (event) => {
  try {
    console.log(event);
    const { productId } = event.pathParameters;

    const product = await joinedProducts(productId);

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
