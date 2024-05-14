const {MongoClient} = require('mongodb');

let _db;

async function connectDB() {
    if (!_db) {
        const client = new MongoClient("mongodb://localhost:27017/clubs-hub");
        await client.connect();
        _db = client.db('clubs-hub');
    }
    return _db;
}

module.exports = connectDB;