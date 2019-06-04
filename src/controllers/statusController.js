class StatusController {
    /**
     * @param {object} options 
     * @param {function} options.SuccessResponse
     * @param {Environment} options.environment
     */
    constructor(options) {
        this.SuccessResponse = options.SuccessResponse;
        this.environment = options.environment;
    }

    /**
     * @param {StatusController~responseCallback} callback 
     */
    getServerStatus(callback) {
        const response = new this.SuccessResponse()
            .setType("Status")
            .setProperty("status", "ok")
            .setProperty("environment", this.environment.mode);
        setImmediate(function () {
            callback(response);
        });
    }

    /**
     * @callback StatusController~responseCallback
     * @param {SuccessResponse} response
     */
}

module.exports = StatusController;
