import { LogLevel } from '../typings'

export function shouldLog(currentLevel: LogLevel, logLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'error', 'info', 'ready', 'warn']
    return levels.indexOf(currentLevel) >= levels.indexOf(logLevel)
}
