import { PrismaClient } from '@prisma/client'
import Mongo from './mongo.util'
import UserMigrations from './user.util'

export default class Migrations {
    private prisma: PrismaClient
    private migrations: UserMigrations
    private mongo: Mongo

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.mongo = new Mongo()

        this.migrations = new UserMigrations(this.prisma, this.mongo)
    }

    /**
     * Migrate all CordX Users to User Entities
     */
    async start() {
        console.log('Connecting to MongoDB...')
        await this.mongo.connect()
        console.log('Connected to MongoDB')

        const userCollection = this.mongo.getCollection('cordxusers')
        const users = await userCollection.find().toArray()

        console.log(`Found ${users.length} users in MongoDB`)
        console.log('Users:', users)

        for (const user of users) {
            if (!user.userId) {
                console.error('User document is missing userId:', user)
                continue
            }

            console.log('User document:', user)
            const response = await this.migrations.migrateUser(user.userId)

            if (response.success) {
                console.log(`Successfully migrated user: ${user.userId}`)
                console.log(`Entity ID: ${response.data.userid}`)
            } else {
                console.error(`Failed to migrate user: ${user.userId} - ${response.message}`)
            }
        }

        console.log('Disconnecting from MongoDB...')
        await this.mongo.disconnect()
        console.log('Disconnected from MongoDB')

        console.log('Disconnecting from Prisma...')
        await this.prisma.$disconnect()
        console.log('Disconnected from Prisma')
    }
}
