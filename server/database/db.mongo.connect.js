const { MongoClient } = require('mongodb');

class MongoDatabase {
    

    constructor() {
        this.connectStr = 'mongodb://127.0.0.1';
        this.connectOption = { useNewUrlParser: true };
        this.database = null;
        this.init()
    }

    async init() {
        const db = await MongoClient.connect(this.connectStr, this.connectOption)
        this.database = db
        return db
    }

    async getConnection() {
        if (this.database) {
            return this.database
        } else {
            await this.init()
            return this.database
        }
    }
}

const mongo = new MongoDatabase()

module.exports = mongo