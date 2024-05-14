const {MongoClient} = require('mongodb');

let _db;

async function connectDB() {
    if (!_db) {
        const uri = "mongodb+srv://admin:admin@clubs-hub.fjilfcm.mongodb.net/?retryWrites=true&w=majority&appName=clubs-hub";
        const client = new MongoClient(uri);
        await client.connect();
        _db = client.db('clubs-hub');
    }
    return _db;
}

module.exports = connectDB;