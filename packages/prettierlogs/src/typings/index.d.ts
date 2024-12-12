export type LogLevel = 'info' | 'warn' | 'error' | 'ready' | 'debug'

export interface LogFile {
    path: string
    enabled: boolean
}
