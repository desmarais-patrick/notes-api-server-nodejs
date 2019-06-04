class StatusController {
    /**
     * @param {object} options 
     * @param {function} options.SuccessResponse
     */
    constructor(options) {
        this.SuccessResponse = options.SuccessResponse;
    }

    getServerStatus(callback) {
        const response = new this.SuccessResponse()
            .setType("Status")
            .setProperty("status", "ok");
        setImmediate(function () {
            callback(response);
        });
    }
}

module.exports = StatusController;
