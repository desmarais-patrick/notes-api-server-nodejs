class ErrorController {
    /**
     * @param {object} options
     * @param {function} options.ErrorResponse
     */
    constructor(options) {
        this.ErrorResponse = options.ErrorResponse;
    }

    /**
     * 
     * @param {string} whatsWrongWithRequest Explanation why request is malformed.
     * @param {ErrorController~responseCallback} callback
     */
    badRequest(whatsWrongWithRequest, callback) {
        const response = new this.ErrorResponse()
            .setStatusCode(400)
            .setMessage(`Bad request: ${whatsWrongWithRequest}`);
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
