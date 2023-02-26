'use strict';

const { products } = require('mockData/products.js');

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
