'use strict';

const products = require('src/mockData/products.json');

module.exports.getProductsList = async (event) => {
  try {
    //emulating asinc operation
    const getProductsListPromise = Promise.resolve(products);

    const productsList = await getProductsListPromise;

    return {
      statusCode: 200,
      body: JSON.stringify(productsList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
};
