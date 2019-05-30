class ContextualError {
    type = "";
    message = "";
    context = null;
    stack = null;

    constructor(type, message, nativeOrParentError) {
        this.type = type;
        this.message = message;
        this.context = nativeOrParentError;
    }

    toString() {
        const contextString = this.context.stack || this.context.toString();
            // `this.context.stack` fetches the javascript Error's property.
        return `[${this.type}] ${this.message} ${contextString}`;
    }
}
ContextualError.ERROR_TYPES = {
    databaseError: "DATABASE_ERROR",
    invalidInput: "INVALID_INPUT",
    missingInput: "MISSING_INPUT",
    notImplementedYet: "NOT_IMPLEMENTED_YET"
};

module.exports = {
    ContextualError
};
