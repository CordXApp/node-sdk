export interface Config {
    workerId: number
    processId: number
    increment: number
    sequence: bigint
    epoch: number
    debug: boolean
}

export interface DecomposeProps {
    timestamp: number
    workerId: number
    processId: number
    sequence: number
}
