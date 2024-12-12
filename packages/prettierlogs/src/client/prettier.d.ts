import { LogFile, LogLevel } from '../typings'
export declare class prettier {
    prefix?: string
    private logLevel
    private logFile
    constructor(prefix?: string, logLevel?: LogLevel, logFile?: LogFile)
    private formatMessage
    private logToFile
    private log
    setLogLevel(level: LogLevel): void
    info(message: string | object): void
    warn(message: string | object): void
    error(message: string | object): void
    ready(message: string | object): void
    debug(message: string | object): void
}
//# sourceMappingURL=prettier.d.ts.map
