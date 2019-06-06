class Router {
    /**
     * @param {object} options 
     * 
     * @param {url} options.URL Node.js `url` module
     * 
     * @param {function} options.ContextualError
     * @param {function} options.ListRequest
     * 
     * @param {ErrorController} options.errorController
     * @param {NotesController} options.notesController
     * @param {WelcomeController} options.welcomeController
     */
    constructor(options) {
        this.URL = options.URL;

        this.ContextualError = options.ContextualError;
        this.ListRequest = options.ListRequest;

        this.errorController = options.errorController;
        this.notesController = options.notesController;
        this.welcomeController = options.welcomeController;
    }

    /**
     * Routes server requests to corresponding controllers before 
     * sending back the server response.
     * 
     * @param {http.IncomingMessage} incomingMessage Readable stream for 
     * request events.
     * @param {http.ServerResponse} serverResponse Writable stream for 
     * request events.
     */
    route(incomingMessage, serverResponse) {
        const method = incomingMessage.method;
        const urlPath = this._parseUrlPath(incomingMessage);
        switch(method + " " + urlPath) {
            case "GET /":
                this._welcome(incomingMessage, serverResponse);
                break;
            case "GET /notes":
                this._getNotesList(incomingMessage, serverResponse);
                break;
            case "POST /notes":
                this._createNote(incomingMessage, serverResponse);
                break;
            default:
                this._handleNotFound(incomingMessage, serverResponse);
                break;
        }
    }

    _welcome(incomingMessage, serverResponse) {
        this.welcomeController.welcome(
            (response) => this._send(serverResponse, response));
    }

    _getNotesList(incomingMessage, serverResponse) {
        const offset = this._parseQueryParameter(incomingMessage, "offset", 0);
        const limit = this._parseQueryParameter(incomingMessage, "limit", 10);
        const request = new this.ListRequest()
            .setOffset(offset)
            .setLimit(limit);
        this.notesController.list(request, 
            (response) => this._send(serverResponse, response));
    }

    _parseQueryParameter(incomingMessage, parameterName, defaultValue) {
        const url = this.URL.parse(incomingMessage.url, true);
        const value = url.query[parameterName];
        return value || defaultValue;
    }

    _handleNotFound(incomingMessage, serverResponse) {
        const pathToRequestResource = this._parseUrlPath(incomingMessage);
        this.errorController.notFound(pathToRequestResource, 
            (response) => this._send(serverResponse, response));
    }

    _parseUrlPath(incomingMessage) {
        const url = this.URL.parse(incomingMessage.url);
        return url.pathname;
    }

    _createNote(incomingMessage, serverResponse) {
        let body = "";
        incomingMessage.on("error", (err) => {
            const contextualError = new this.ContextualError(
                "[Router] Failed to read incoming message body to create a note.", 
                err);
            this.errorController.internalServerError(
                "error processing request",
                contextualError,
                (response) => this._send(serverResponse, response));
        });
        incomingMessage.on("data", function (chunk) {
            // TODO Add security on the maximum body size. ==> 400: Message is too long!
            body += chunk;
        });
        incomingMessage.on("end", () => {
            if (body.length === 0) {
                this.errorController.badRequest(
                    "empty body",
                    null,
                    (response) => this._send(serverResponse, response));
                return;
            }

            let apiJson;
            try {
                apiJson = JSON.parse(body);
            } catch (err) {
                const contextualError = new this.ContextualError(
                    `[Router] Failed to parse JSON from incoming message body, in order to create a note.\nReceived:\n${body}`,
                    err);
                this.errorController.badRequest(
                    "bad JSON",
                    contextualError,
                    (response) => this._send(serverResponse, response));
                return;
            }
            this.notesController.create(apiJson,
                (response) => this._send(serverResponse, response));
        });
    }

    _send(serverResponse, response) {
        serverResponse.statusCode = response.statusCode;
        serverResponse.setHeader("Content-Type", response.contentType);

        const stringData = response.content;
        serverResponse.setHeader("Content-Length", Buffer.byteLength(stringData));
        serverResponse.end(stringData);
    }
}

module.exports = Router;
