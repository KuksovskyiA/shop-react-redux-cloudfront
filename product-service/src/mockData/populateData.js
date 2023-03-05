const AWS = require('aws-sdk');
AWS.config.update({region:'eu-west-1'});
const ddb = new AWS.DynamoDB.DocumentClient();

const products = require('./products.json');
const stocks = require('./stocks.json');

const postItem = async (tableName, item) => {
    try {
        await ddb.put({
            TableName: tableName,
            Item: item
        }).promise();
    } catch (error) {
        throw new Error(error);
    }
};

const populateData = async (tableName) => {
    try {
        const currentData = tableName === 'products' ? products : stocks;

        await Promise.all(currentData.map(async (item) => await postItem(tableName, item)));
    } catch (error) {
        throw new Error(error);
    }
};

populateData('products');
populateData('stocks');

