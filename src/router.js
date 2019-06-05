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
     */
    constructor(options) {
        this.URL = options.URL;

        this.ContextualError = options.ContextualError;
        this.ListRequest = options.ListRequest;

        this.errorController = options.errorController;
        this.notesController = options.notesController;
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
                this._sendWelcome(incomingMessage, serverResponse);
                break;
            case "GET /notes":
                this._getNotesList(incomingMessage, serverResponse);
                break;
            case "POST /notes":
                this._createNote(incomingMessage, serverResponse);
                break;
            default:
                this._sendNotFound(incomingMessage, serverResponse);
                break;
        }
    }

    _sendWelcome(incomingMessage, serverResponse) {
        const welcomeMessage = "Welcome to the Notes API! 📔" + "\n" +
            "\n" + 
            "Available endpoints:" + "\n" +
            "\n" +
            " - GET `/notes`" + "\n";
        this._sendText(serverResponse, welcomeMessage);
    }

    _sendText(serverResponse, stringData) {
        serverResponse.statusCode = 200;
        serverResponse.setHeader("Content-Type", "text/plain;charset=UTF-8");
        serverResponse.setHeader("Content-Length", Buffer.byteLength(stringData));
        serverResponse.end(stringData);
    }

    _getNotesList(incomingMessage, serverResponse) {
        const offset = this._parseQueryParameter(incomingMessage, "offset", 0);
        const limit = this._parseQueryParameter(incomingMessage, "limit", 10);
        const request = new this.ListRequest()
            .setOffset(offset)
            .setLimit(limit);
        this.notesController.list(request, 
            (response) => this._sendJson(serverResponse, response));
    }

    _parseQueryParameter(incomingMessage, parameterName, defaultValue) {
        const url = this.URL.parse(incomingMessage.url, true);
        const value = url.query[parameterName];
        return value || defaultValue;
    }

    _sendNotFound(incomingMessage, serverResponse) {
        const pathToRequestResource = this._parseUrlPath(incomingMessage);
        this.errorController.notFound(pathToRequestResource, 
            (response) => this._sendJson(serverResponse, response));
    }

    _parseUrlPath(incomingMessage) {
        const url = this.URL.parse(incomingMessage.url);
        return url.pathname;
    }

    _sendJson(serverResponse, response) {
        serverResponse.statusCode = response.statusCode;
        serverResponse.setHeader("Content-Type", "application/json;charset=UTF-8");

        const stringData = response.toString();
        serverResponse.setHeader("Content-Length", Buffer.byteLength(stringData));
        serverResponse.end(stringData);
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
                (response) => this._sendJson(serverResponse, response));
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
                    (response) => this._sendJson(serverResponse, response));
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
                    (response) => this._sendJson(serverResponse, response));
                return;
            }
            this.notesController.create(apiJson,
                (response) => this._sendJson(serverResponse, response));
        });
    }
}

module.exports = Router;
