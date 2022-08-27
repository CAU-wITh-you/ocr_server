const config = require('../config');
const MongoDb = require('mongodb');

async function connectDB(){
    return (await MongoDb.MongoClient.connect(config.db_host)).then( (client) => client.db());
}

module.exports.connectDB = connectDB;