class ContextualError {
    /**
     * @param {string} message 
     * @param {Error|ContextualError} nativeOrParentError 
     */
    constructor(message, nativeOrParentError) {
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
        return `${this.message}: ${contextString}`;
    }
}

module.exports = ContextualError;
