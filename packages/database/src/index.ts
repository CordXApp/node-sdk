import { PrismaClient } from '@prisma/client'
import { BlogClient } from './clients/blog'
import { DNSClient } from './clients/dns'
import { EntityClient } from './clients/entities'
import { OrgClient } from './clients/orgs'
import { OtherClients } from './clients/other'
import { PartnerClient } from './clients/partners'
import { PermsClient } from './clients/perms'
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

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.MYSQL_URI }
    }
})

export class CordXDatabase {
    public prisma: PrismaClient
    public blog: BlogClient
    public dns: DNSClient
    public entities: EntityClient
    public orgs: OrgClient
    public other: OtherClients
    public partners: PartnerClient
    public perms: PermsClient

    constructor() {
        this.prisma = prisma

        this.blog = new BlogClient(this);
        this.dns = new DNSClient(this);
        this.entities = new EntityClient(this);
        this.orgs = new OrgClient(this);
        this.other = new OtherClients(this);
        this.partners = new PartnerClient(this);
        this.perms = new PermsClient(this);

        validateEnvVars()
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
