const http = require("http");

class Server {
    constructor(options) {
        this.port = options.port;
        this.router = options.router;

        this.httpServer = http.createServer((incomingMessage, httpResponse) => {
            this.router.route(incomingMessage, httpResponse);
        });
    }

    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}

module.exports = {
    Server
};
