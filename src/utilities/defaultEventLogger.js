class DefaultEventLogger {
    constructor(options) {
        this.appropriateLogLevels = [];
        this._setAppropriateLogLevels(options.highestLogLevel);
    }

    _setAppropriateLogLevels(highestLogLevel) {
        const matchingLogLevelFound = false;
        DefaultEventLogger.LOG_LEVELS.forEach((logLevel) => {
            if (logLevel === highestLogLevel) {
                this.appropriateLogLevels.push(logLevel);
                matchingLogLevelFound = true;
            } else if (matchingLogLevelFound) {
                this.appropriateLogLevels.push(logLevel);
            }
        });
    }

    notifyEvent(type, message, additionalInfo) {
        const eventLevel = additionalInfo.level;
        if (this.appropriateLogLevels.indexOf(eventLevel) !== -1) {
            this._print(eventLevel, type, message);
        }
    }

    _print(type, message) {
        const date = (new Date()).toString();
        console.log(`${date} [${level}] ${type}: ${message}`);
    }
}
DefaultEventLogger.LOG_LEVELS = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", 
    "FATAL"];

module.exports = DefaultEventLogger;
