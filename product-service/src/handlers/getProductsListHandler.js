'use strict';
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient();
const productTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const getStockProductCount = async (productId) => {
  try {
    const stockProduct = await db.get({
      TableName: stocksTable,
      Key: {
        'product_id': productId
      },
    }).promise();

    return stockProduct.Item.count;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getProductsList = async (event) => {
  try {
    console.log(event);
    const productsList = await db.scan({
      TableName: productTable
    }).promise();

    const joinedProducts = await Promise.all(
      productsList.Items.map(async (item) => {
        item.count = await getStockProductCount(item.id);
        return item;
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(joinedProducts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
};
