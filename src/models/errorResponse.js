const BaseResponse = require("./baseResponse");

class ErrorResponse extends BaseResponse {
    constructor() {
        super();
        this.message = "";
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

    _formatJson() {
        return {
            type: "Error",
            code: this.statusCode,
            message: this.message
        }
    }
}

module.exports = ErrorResponse;
