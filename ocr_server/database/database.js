const config = require('../config');
import MongoDb from 'mongodb';

export async function connectDB(){
    return (await MongoDb.MongoClient.connect(config.db_host)).then( (client) => client.db());
}