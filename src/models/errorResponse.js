class ErrorResponse {
    constructor() {
        this.statusCode = null;
        this.message = null;
    }

    /**
     * 
     * @param {number} statusCode 
     * @returns {ErrorResponse} For chaining.
     */
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    /**
     * 
     * @param {string} message 
     * @returns {ErrorResponse} For chaining.
     */
    setMessage(message) {
        this.message = message;
        return this;
    }

    /**
     * @returns {string} Formatted response for sending over the wire.
     */
    toString() {
        const json = {
            type: "Error",
            code: this.statusCode,
            message: this.message
        };

        return JSON.stringify(json);
    }
}

module.exports = ErrorResponse;
