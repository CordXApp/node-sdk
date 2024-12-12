import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = ['MYSQL_URI', 'TOKEN']

function validateEnvVars() {
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            throw new Error(`Environment variable: ${varName} is not defined/set in the projects .env file`)
        }
    }
}

validateEnvVars()

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.MYSQL_URI }
    }
})

export class CordXDatabase {
    public prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    public async isConnected(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`
            console.info(`Connected to prisma successfully!`)
            return true
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(`Error establishing connection: ${err.message}`)
            } else {
                console.error(`An unknown error occurred`)
            }

            return false
        }
    }
}
