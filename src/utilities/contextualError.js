const ERROR_TYPES = {
    invalidInput: "INVALID_INPUT",
    missingInput: "MISSING_INPUT",
    notImplementedYet: "NOT_IMPLEMENTED_YET"
};

class ContextualError {
    constructor(type, message, nativeOrParentError) {
        this.type = type;
        this.message = message;
        this.context = nativeOrParentError;
        this.stack = null;
    }

    toString() {
        const contextString = this.context.stack || this.context.toString();
        return `[${this.type}] ${this.message} ${contextString}`;
    }
}

module.exports = {
    ContextualError: ContextualError,
    ERROR_TYPES: ERROR_TYPES
};
