const config = require('../config');
const MongoDb = require('mongodb');


let db;
async function connectDB(){
    return MongoDb.MongoClient.connect(config.db_host).then( (client) => db = client.db());
}

function getMp4s(){
    return db.collection('mp4s');
}

function getLoadingMp4s(){
    return db.collection('loading_mp4s');
}

module.exports.getMp4s = getMp4s;
module.exports.getLoadingMp4s = getLoadingMp4s;
module.exports.connectDB = connectDB;