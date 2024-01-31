export interface ICordXSnowflake {
    generate(): string
    decompose(id: string): { timestamp: number; workerId: number; processId: number; sequence: number }
}

export interface ICordXSnowflakeOptions {
    workerId: number
    processId: number
    epoch: number
    increment: number
    debug?: boolean
    sequence: bigint
}
