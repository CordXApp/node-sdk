'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.shouldLog = shouldLog
function shouldLog(currentLevel, logLevel) {
    const levels = ['debug', 'error', 'info', 'ready', 'warn']
    return levels.indexOf(currentLevel) >= levels.indexOf(logLevel)
}
//# sourceMappingURL=shouldLog.js.map
