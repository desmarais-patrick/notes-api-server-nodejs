class ContextualError {
    /**
     * @param {string} type 
     * @param {string} message 
     * @param {Error|ContextualError} nativeOrParentError 
     */
    constructor(type, message, nativeOrParentError) {
        this.type = type;
        this.message = message;
        this.context = nativeOrParentError;
        this.stack = null;
    }

    /**
     * @returns {string}
     */
    toString() {
        const contextString = this.context.stack || this.context.toString();
            // `this.context.stack` fetches the javascript Error's call stack.
        return `[${this.type}] ${this.message} ${contextString}`;
    }
}

ContextualError.ERROR_TYPES = {
    databaseError: "DATABASE_ERROR",
    invalidInput: "INVALID_INPUT",
    missingInput: "MISSING_INPUT",
    notImplementedYet: "NOT_IMPLEMENTED_YET"
};

module.exports = ContextualError;
