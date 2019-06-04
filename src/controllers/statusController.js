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

    getServerStatus(callback) {
        const response = new this.SuccessResponse()
            .setType("Status")
            .setProperty("status", "ok")
            .setProperty("environment", this.environment.mode);
        setImmediate(function () {
            callback(response);
        });
    }
}

module.exports = StatusController;
