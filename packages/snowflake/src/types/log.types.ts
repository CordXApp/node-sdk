export interface ILogs {
    prefix: string
    silent: boolean
    info(message: string | object): void
    success(message: string | object): void
    error(message: string | object): void
    debug(message: string | object): void
    fatal(message: string | object): void
    warn(message: string | object): void
}
