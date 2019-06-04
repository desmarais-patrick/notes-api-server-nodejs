class Server {
    /**
     * @param {object} options
     * @param {http} options.HTTP
     * @param {number} options.port
     * @param {Router} options.router
     */
    constructor(options) {
        this.port = options.port;
        this.router = options.router;

        this.httpServer = options.HTTP.createServer(
            (incomingMessage, serverResponse) => {
                this.router.route(incomingMessage, serverResponse);
            }
        );
    }

    /**
     * @param {Server~errorCallback} errorCallback 
     */
    addErrorHandler(errorCallback) {
        this.httpServer.on("error", errorCallback);
    }
    /**
     * @callback Server~errorCallback
     * @param {Error} err
     */

    /**
     * @param {Server~startCallback} listeningCallback 
     */
    start(listeningCallback) {
        this.httpServer.listen(this.port, listeningCallback);
    }
    /**
     * @callback Server~listeningCallback
     * No parameters.
     */
}

module.exports = Server;
