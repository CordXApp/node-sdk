import { MongoClient } from 'mongodb'

export default class Mongo {
    private client: MongoClient

    constructor() {
        const uri = process.env.MONGO_URI
        this.client = new MongoClient(uri as string)
    }

    async connect() {
        await this.client.connect()
    }

    async disconnect() {
        await this.client.close()
    }

    getCollection(collectionName: string) {
        return this.client.db().collection(collectionName)
    }
}
