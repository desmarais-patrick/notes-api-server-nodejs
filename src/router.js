class Router {
    /**
     * @param {object} options 
     * @param {url} options.urlModule
     * @param {function} options.listRequestClass
     * @param {ErrorController} options.errorController
     * @param {NotesController} options.notesController
     */
    constructor(options) {
        this.urlModule = options.urlModule;

        this.listRequestClass = options.listRequestClass;

        this.errorController = options.errorController;
        this.notesController = options.notesController;
    }

    /**
     * Routes server requests to corresponding controllers before 
     * sending back the server response.
     * 
     * @param {http.IncomingMessage} incomingMessage 
     * @param {http.ServerResponse} serverResponse 
     */
    route(incomingMessage, serverResponse) {
        const urlPath = this._parseUrlPath(incomingMessage);
        switch(urlPath) {
            case "/":
                this._getNotesList(incomingMessage, serverResponse);
                break;
            default:
                this._sendNotFound(incomingMessage, serverResponse);
                break;
        }
    }

    _getNotesList(incomingMessage, serverResponse) {
        const offset = this._parseQueryParameter(incomingMessage, "offset", 0);
        const limit = this._parseQueryParameter(incomingMessage, "limit", 10);
        const request = new this.listRequestClass()
            .setOffset(offset)
            .setLimit(limit);
        this.notesController.list(request, serverResponse);
    }

    _parseQueryParameter(incomingMessage, parameterName, defaultValue) {
        const url = this.urlModule.parse(incomingMessage.url);
        const value = url.searchParams.get(parameterName);
        return value || defaultValue;
    }

    _sendNotFound(incomingMessage, serverResponse) {
        const pathToRequestResource = this._parseUrlPath(incomingMessage);
        const message = `Resource '${pathToRequestResource}' not found.`;
        return new ErrorResponse()
            .setStatusCode(404)
            .setMessage(message)
            .send(serverResponse);
    }

    _parseUrlPath(incomingMessage) {
        const url = this.urlModule.parse(incomingMessage.url);
        return url.pathname;
    }

    _sendJson(serverResponse, response) {
        serverResponse.statusCode = response.getStatusCode();
        serverResponse.setHeader("Content-Type", "application/json");

        const stringData = JSON.stringify(response.getJsonData());
        serverResponse.setHeader("Content-Length", 
            Buffer.byteLength(stringData));
        serverResponse.write(stringData, ENCODING);

        serverResponse.end();
    }
}

module.exports = Router;
