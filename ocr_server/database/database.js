const config = require('../config');
const MongoDb = require('mongodb');

export async function connectDB(){
    return (await MongoDb.MongoClient.connect(config.db_host)).then( (client) => client.db());
}