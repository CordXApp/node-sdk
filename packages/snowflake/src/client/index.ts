import { Logs } from './logger'
import { ICordXSnowflake, ICordXSnowflakeOptions } from '../types/snowflake.types'

export class CordXSnowflake implements ICordXSnowflake {
    private static usedIds: Set<string> = new Set()
    private lastTimestamp: bigint = -1n
    public static logs: Logs = Logs.getInstance('CordX:Snowflake', false)
    private _workerId: number
    private _processId: number
    private _epoch: number
    private _increment: number
    private _debug: boolean = false
    private _sequence: bigint

    constructor(options: ICordXSnowflakeOptions) {
        if (!options) throw new Error('No options provided')
        if (!options.epoch) throw new Error('No epoch provided')
        if (!options.workerId) throw new Error('No worker ID provided')
        if (!options.processId) throw new Error('No process ID provided')
        if (!options.increment) throw new Error('No increment provided')
        if (options.increment > 4095) throw new Error('Increment cannot be greater than 4095')
        if (options.workerId > 31) throw new Error('Worker ID cannot be greater than 31')
        if (options.processId > 31) throw new Error('Process ID cannot be greater than 31')
        if (!options.sequence) throw new Error('No sequence provided')
        if (options.sequence > 4095n) throw new Error('Sequence cannot be greater than 4095')

        this._epoch = options.epoch
        this._workerId = options.workerId
        this._processId = options.processId
        this._increment = options.increment
        this._debug = options.debug ?? false
        this._sequence = options.sequence

        if (this._debug) CordXSnowflake.logs.debug(`Snowflake initialized with options: ${JSON.stringify(options)}`)
    }

    /**
     * @function generate
     * @description Generates a new snowflake ID
     * @returns {string} Snowflake ID
     * @memberof CordXSnowflake
     */
    public generate(): string {
        let timestamp = BigInt(this.timeGen())

        if (this._debug) CordXSnowflake.logs.debug(`Generating timestamp ${timestamp}`)

        if (timestamp === this.lastTimestamp) {
            this._sequence = (this._sequence + 1n) & 4095n

            if (this._debug) CordXSnowflake.logs.debug(`Generated new sequence ${this._sequence}`)

            if (this._sequence === 0n) {
                timestamp = BigInt(this.tilNextMillis(Number(this.lastTimestamp)))
                if (this._debug) CordXSnowflake.logs.debug(`Generated new timestamp ${timestamp}`)
            }
        } else {
            this._sequence = 0n
            if (this._debug) CordXSnowflake.logs.debug(`Generated new sequence ${this._sequence}`)
        }

        this.lastTimestamp = timestamp
        if (this._debug) CordXSnowflake.logs.debug(`Generated new last timestamp ${this.lastTimestamp}`)

        const timestampShifted = timestamp << 22n
        const workerIdShifted = BigInt(this._workerId) << 17n
        const processIdShifted = BigInt(this._processId) << 12n
        const id = String(timestampShifted | workerIdShifted | processIdShifted | this._sequence)

        if (this._debug) CordXSnowflake.logs.debug(`Generated new ID ${id}`)

        if (CordXSnowflake.usedIds.has(id)) {
            if (this._debug) CordXSnowflake.logs.debug(`Snowflake ID ${id} already exists, generating new ID`)
            return this.generate()
        }

        if (this._debug) CordXSnowflake.logs.debug(`Snowflake ID ${id} generated`)

        CordXSnowflake.usedIds.add(id)
        return id
    }

    /**
     * @function decompose
     * @description Decomposes a snowflake ID into its components
     * @param {string} id Snowflake ID
     * @returns {{ timestamp: number; workerId: number; processId: number; sequence: number }} Snowflake components
     * @memberof CordXSnowflake
     */
    public decompose(id: string): { timestamp: number; workerId: number; processId: number; sequence: number } {
        const idNumber = BigInt(id)
        const timestamp = Number((idNumber >> 22n) + BigInt(this._epoch))
        const workerId = Number((idNumber & 0x3e0000n) >> 17n)
        const processId = Number((idNumber & 0x1f000n) >> 12n)
        const sequence = Number(idNumber & 0xfffn)

        if (this._debug) {
            CordXSnowflake.logs.debug(
                `Decomposed ID ${id} into timestamp ${timestamp}, worker ID ${workerId}, process ID ${processId}, and sequence ${sequence}`
            )
        }

        return { timestamp, workerId, processId, sequence }
    }

    private timeGen(): number {
        if (this._debug) CordXSnowflake.logs.debug(`current time: ${Date.now() - this._epoch}`)
        return Date.now() - this._epoch
    }

    private tilNextMillis(lastTimestamp: number): number {
        let timestamp = this.timeGen()
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen()
            if (this._debug) CordXSnowflake.logs.debug('Waiting for next millisecond')
        }
        return timestamp
    }
}
