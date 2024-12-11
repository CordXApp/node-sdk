import { appendFileSync } from "node:fs";
import { LogFile, LogLevel } from "../typings";
import { getTimestamp } from "../helpers/getTimestamp";
import { shouldLog } from "../helpers/shouldLog";

import {
    COLOR_RED,
    COLOR_GREEN,
    COLOR_YELLOW,
    COLOR_BLUE,
    COLOR_MAGENTA,
    COLOR_RESET
} from "../helpers/constants";

export class prettier {
    public prefix?: string;
    private logLevel: LogLevel;
    private logFile: LogFile;

    constructor(prefix?: string, logLevel: LogLevel = 'info', logFile: LogFile = { path: '', enabled: false }) {
        this.prefix = prefix;
        this.logLevel = logLevel;
        this.logFile = logFile;
    }

    private formatMessage(level: LogLevel, message: string | object): string {
        return `[${getTimestamp()}] ${this.prefix ? this.prefix + ' | ' : 'prettierlogs'}${level.toUpperCase()} - ${typeof message === 'string' ? message : JSON.stringify(message)}`;
    }

    private logToFile(message: string): void {
        if (this.logFile.enabled && this.logFile.path) {
            appendFileSync(this.logFile.path, message + '\n', 'utf8');
        }

        throw new Error('[LOG_FILE]: invalid params, please make sure logFile is enabled with a set path. If you do not want to log files you can remove the logFile config entirely');
    }

    private log(level: LogLevel, color: string, message: string | object): void {
        if (shouldLog(level, this.logLevel)) {
            const formattedMessage = this.formatMessage(level, message);
            console.log(`${color}${formattedMessage}${COLOR_RESET}`);
            this.logToFile(formattedMessage);
        }
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public info(message: string | object): void {
        this.log('info', COLOR_BLUE, message);
    }

    public warn(message: string | object): void {
        this.log('warn', COLOR_YELLOW, message);
    }

    public error(message: string | object): void {
        this.log('error', COLOR_RED, message);
    }

    public ready(message: string | object): void {
        this.log('ready', COLOR_GREEN, message);
    }

    public debug(message: string | object): void {
        this.log('debug', COLOR_MAGENTA, message);
    }
}