'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.prettier = void 0
const node_fs_1 = require('node:fs')
const getTimestamp_1 = require('../helpers/getTimestamp')
const shouldLog_1 = require('../helpers/shouldLog')
const constants_1 = require('../helpers/constants')
class prettier {
    prefix
    logLevel
    logFile
    constructor(prefix, logLevel = 'info', logFile = { path: '', enabled: false }) {
        this.prefix = prefix
        this.logLevel = logLevel
        this.logFile = logFile
    }
    formatMessage(level, message) {
        return `[${(0, getTimestamp_1.getTimestamp)()}] ${this.prefix ? this.prefix + ' | ' : 'prettierlogs'}${level.toUpperCase()} - ${typeof message === 'string' ? message : JSON.stringify(message)}`
    }
    logToFile(message) {
        if (this.logFile.enabled && this.logFile.path) {
            ;(0, node_fs_1.appendFileSync)(this.logFile.path, message + '\n', 'utf8')
        }
        throw new Error(
            '[LOG_FILE]: invalid params, please make sure logFile is enabled with a set path. If you do not want to log files you can remove the logFile config entirely'
        )
    }
    log(level, color, message) {
        if ((0, shouldLog_1.shouldLog)(level, this.logLevel)) {
            const formattedMessage = this.formatMessage(level, message)
            console.log(`${color}${formattedMessage}${constants_1.COLOR_RESET}`)
            this.logToFile(formattedMessage)
        }
    }
    setLogLevel(level) {
        this.logLevel = level
    }
    info(message) {
        this.log('info', constants_1.COLOR_BLUE, message)
    }
    warn(message) {
        this.log('warn', constants_1.COLOR_YELLOW, message)
    }
    error(message) {
        this.log('error', constants_1.COLOR_RED, message)
    }
    ready(message) {
        this.log('ready', constants_1.COLOR_GREEN, message)
    }
    debug(message) {
        this.log('debug', constants_1.COLOR_MAGENTA, message)
    }
}
exports.prettier = prettier
//# sourceMappingURL=prettier.js.map
