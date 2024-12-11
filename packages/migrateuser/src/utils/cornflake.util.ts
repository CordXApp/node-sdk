import { CordXSnowflake } from '@cordxapp/snowflake'

interface CornflakeConfig {
    workerId: number
    processId: number
    epoch: number
    increment: number
    sequence: bigint
    debug: boolean
}

export default class Cornflake {
    private cornflake: CordXSnowflake

    constructor(config: CornflakeConfig) {
        this.cornflake = new CordXSnowflake(config)
    }

    public create(): string {
        return this.cornflake.generate()
    }

    public async decompose(
        id: string
    ): Promise<{ timestamp: number; workerId: number; processId: number; sequence: number }> {
        return this.cornflake.decompose(id)
    }
}
