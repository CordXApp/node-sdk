import Logger from '../../utils/logger.util'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import Cornflake from '../../utils/cornflake.util'
import { UserEntity } from './user.entity'
import { CordXDatabase } from '../..'
import axios from 'axios'

export class EntityClient {
    private discordApiUrl: string
    public cornflake: Cornflake
    public logs: Logger
    public db: CordXDatabase

    public users: UserEntity

    constructor(db: CordXDatabase) {
        this.discordApiUrl = 'https://proxy.cordx.lol/api'
        this.logs = new Logger(`[@cordxapp/db]:entity_client`)
        this.db = db

        this.users = new UserEntity(this)

        this.validateBotId = this.validateBotId.bind(this)
        this.validateUserId = this.validateUserId.bind(this)
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
     * Validate a Discord Bot/Client ID using the Discord API
     */
    public async validateBotId(id: string): Promise<boolean> {
        try {
            const response = await axios.get(this.discordApiUrl + '/applications/' + id, {
                headers: { Authorization: `Bot ${process.env.TOKEN}` }
            })

            return response.status === 200
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Failed to validate Bot ID: ${err.message}`)
            } else {
                this.logs.error(`Failed to validate Bot ID with an unknown error`)
                this.logs.debug(`Debug: ${err}`)
            }

            return false
        }
    }

    /**
     * Validate a Discord User ID using the Discord API
     */
    public async validateUserId(id: string): Promise<boolean> {
        try {
            const response = await axios.get(this.discordApiUrl + '/users/' + id, {
                headers: { Authorization: `Bot ${process.env.TOKEN}` }
            })

            return response.status === 200
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Failed to validate User ID: ${err.message}`)
            } else {
                this.logs.error(`Failed to validate User ID with an unknown error`)
                this.logs.debug(`Debug: ${err}`)
            }

            return false
        }
    }

    public async createApiKey(): Promise<string> {
        return randomBytes(32).toString('hex')
    }

    public async encrypt(data: string, key?: string): Promise<string> {
        try {
            if (!key) key = process.env.ENCRYPTION_KEY

            const iv = randomBytes(16)
            const cipher = createCipheriv('aes-256-gcm', key as string, iv)

            this.logs.info(`Encrypting data`)

            let encrypted = cipher.update(data, 'utf8', 'hex')
            encrypted += cipher.final('hex')

            this.logs.info(`Generating authentication tag`)

            const tag = cipher.getAuthTag()

            this.logs.ready(`Data encrypted successfully!`)

            return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex')
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Error encrypting data: ${err.message}`)
                return ''
            }

            this.logs.error(`Error encrypting data`)
            return ''
        }
    }

    public async decrypt(data: string, key?: string): Promise<string> {
        try {
            if (!key) key = process.env.ENCRYPTION_KEY

            this.logs.info(`Attempting data decryption`)

            const parts: any = data.split(':')
            const iv = Buffer.from(parts.shift(), 'hex')
            const tag = Buffer.from(parts.pop(), 'hex')
            const decipher = createDecipheriv('aes-256-gcm', key as string, iv)

            this.logs.info(`Setting authorization tag`)

            decipher.setAuthTag(tag)

            let decrypted = decipher.update(parts.join(':'), 'hex', 'utf8')
            decrypted += decipher.final('utf8')

            this.logs.ready(`Data decrypted successfully`)

            return decrypted
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Error decrypting data: ${err.message}`)
                return ''
            }

            this.logs.error(`Error decrypting data`)
            return ''
        }
    }

    public async partial(data: string): Promise<string> {
        try {
            const parts: any = data.split(':')
            return parts[0]
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Error fetching partial encryption: ${err.message}`)
                return ''
            }

            this.logs.error(`Error fetching partial encryption`)
            return ''
        }
    }
}
