import Logger from './logger.util'
import { Config, DecomposeProps } from '../typings/cornflake'
import { CordXSnowflake } from '@cordxapp/snowflake'

export default class Cornflake {
    private logs: Logger
    private cornflake: CordXSnowflake

    constructor(config: Config) {
        this.logs = new Logger('[@cordxapp/db]')
        this.cornflake = new CordXSnowflake(config)
    }

    public create(): string | undefined {
        try {
            return this.cornflake.generate()
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Failed to generate cornflake: ${err.message}`)
            } else {
                this.logs.error(`An unknown error occurred.`)
            }
            return undefined
        }
    }

    public async decompose(id: string): Promise<DecomposeProps | undefined> {
        try {
            return this.cornflake.decompose(id)
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.logs.error(`Failed to decompose cornflake: ${err.message}`)
            } else {
                this.logs.error(`An unknown error occurred.`)
            }
            return undefined
        }
    }
}
