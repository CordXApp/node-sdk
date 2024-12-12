import Logger from '../../utils/logger.util'
import Cornflake from '../../utils/cornflake.util'
import { UserEntity } from './user.entity'
import { CordXDatabase } from '../..'
import { randomBytes } from 'crypto'
import axios from 'axios'

export class EntityClient {
    private discordApiUrl: string
    public cornflake: Cornflake
    private logs: Logger
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
}
