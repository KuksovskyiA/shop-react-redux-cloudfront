'use strict';

const { products } = require('mockData/products.js');

module.exports.getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  const product = await products.find(({id}) => productId === id );

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
};
