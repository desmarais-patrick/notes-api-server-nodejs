class Router {
    constructor(options) {
        this.urlModule = options.urlModule;

        this.errorController = options.errorController;
        this.notesController = options.notesController;
    }

    route(incomingMessage, httpResponse) {
        const url = this.urlModule.parse(incomingMessage.url);

        console.log("Request for: ", url.pathname);
        if (url.pathname === "/") {
            this.notesController.list(httpResponse, function (err) {
                if (err) {
                    this.errorController.generalError(err.toString(), httpResponse);
                }
            });
        } else {
            this.errorController.notFound(url.pathname, httpResponse);
        }
    }
}

module.exports = {
    Router
};
