import { PrismaClient } from '@prisma/client'
import Cornflake from './cornflake.util'
import { randomBytes } from 'crypto'
import Mongo from './mongo.util'

interface Responses {
    success: boolean
    message: string
    data?: any
}

export default class UserMigrations {
    private prisma: PrismaClient
    private cornflake: Cornflake
    private mongo: Mongo

    constructor(prisma: PrismaClient, mongo: Mongo) {
        this.prisma = prisma
        this.mongo = mongo

        this.createApiKey = this.createApiKey.bind(this)

        this.cornflake = new Cornflake({
            workerId: 1,
            processId: 2,
            increment: 4,
            sequence: 5n,
            debug: false,
            epoch: 3
        })
    }

    /**
     * Migrate a CordX User from MongoDB to our MySQL Entities
     * @param userId The user ID
     * @returns { Promise<Responses> }
     */
    public async migrateUser(userId: string): Promise<Responses> {
        try {
            await this.mongo.connect()

            const usersCollection = this.mongo.getCollection('cordxusers')
            const user: any = await usersCollection.findOne({ userId })

            if (!user) {
                return { success: false, message: 'User not found' }
            }

            const exists = await this.prisma.entity.findFirst({ where: { userid: userId } })

            if (exists) {
                return { success: false, message: 'User has already been migrated to a new entity!' }
            }

            const apiKey = await this.createApiKey()

            const data = {
                id: this.cornflake.create(),
                name: user.globalName,
                handle: user.username,
                type: 'DISCORD_USER',
                userid: user.userId,
                avatar: user.avatar || null,
                banner: user.banner || null,
                apiKey: apiKey
            }

            const newEntity = await this.prisma.entity.create({ data })

            return {
                success: true,
                message: `Successfully migrated user: ${userId}`,
                data: newEntity
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to migrate user: ${err.message}`
            }
        }
    }

    private async createApiKey(): Promise<string> {
        return randomBytes(32).toString('hex')
    }
}
