class ErrorController {
    /**
     * @param {object} options
     * @param {function} options.ErrorResponse
     * @param {Environment} options.environment
     */
    constructor(options) {
        this.ErrorResponse = options.ErrorResponse;

        this.environment = options.environment;
    }

    /**
     * @param {string} whatsWrongWithRequest Explanation why request is malformed.
     * @param {ContextualError|null} contextualError
     * @param {ErrorController~responseCallback} callback
     */
    badRequest(whatsWrongWithRequest, contextualError, callback) {
        let message = `Bad request: ${whatsWrongWithRequest}.`;
        if (this.environment.isDev() && contextualError !== null) {
            message += " " + contextualError.toString();
        }
        const response = new this.ErrorResponse()
            .setStatusCode(400)
            .setMessage(message);
        setImmediate(() => {
            callback(response);
        });
    }

    /**
     * @param {string} generalErrorMessage
     * @param {ContextualError} contextualError 
     * @param {ErrorController~responseCallback} callback 
     */
    internalServerError(generalErrorMessage, contextualError, callback) {
        let message = `Internal server error: ${generalErrorMessage}.`;
        if (this.environment.isDev()) {
            message += " " + contextualError.toString();
        }
        const response = new this.ErrorResponse()
            .setStatusCode(500)
            .setMessage(message);
        setImmediate(() => {
            callback(response);
        });
    }

    /**
     * @param {string} requestedResourcePath
     * @param {ErrorController~responseCallback} callback
     */
    notFound(requestedResourcePath, callback) {
        const response = new this.ErrorResponse()
            .setStatusCode(404)
            .setMessage(`Resource ${requestedResourcePath} not found.`);
        setImmediate(() => {
            callback(response);
        });
    }

    /**
     * @callback ErrorController~responseCallback
     * @param {ErrorResponse} response
     */
}

module.exports = ErrorController;
