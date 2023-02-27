'use strict';

const products = require('src/mockData/products.json');

module.exports.getProductsById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    //emulating asinc operation
    const getProductsByIdPromise = Promise.resolve(products.find(({id}) => productId === id));

    const product = await getProductsByIdPromise;

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
