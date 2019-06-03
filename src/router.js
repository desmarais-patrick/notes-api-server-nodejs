class Router {
    /**
     * @param {object} options 
     * @param {url} options.urlModule
     * @param {ErrorController} options.errorController
     * @param {NotesController} options.notesController
     */
    constructor(options) {
        this.urlModule = options.urlModule;

        this.errorController = options.errorController;
        this.notesController = options.notesController;
    }

    /**
     * Routes server requests to corresponding controllers before 
     * sending back the server response.
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    route(req, res) {
        const url = this.urlModule.parse(req.url);

        console.log("Request for: ", url.pathname);
        if (url.pathname === "/") {
            this.notesController.list(res, function (err) {
                if (err) {
                    this.errorController.generalError(err.toString(), res);
                }
            });
        } else {
            this.errorController.notFound(url.pathname, res);
        }
    }
}

module.exports = {
    Router
};
