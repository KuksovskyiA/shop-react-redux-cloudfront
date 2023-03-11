'use strict';

module.exports.handler = async (event) => {
    try {  
      return {
        statusCode: 200,
        body: event
      };
    } catch (error) {
      return {
        statusCode: 500,
        body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
      };
    }
  };