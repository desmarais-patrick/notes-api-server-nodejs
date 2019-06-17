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

        this.TEST_NOTE_ID_REGEXP = /^\/notes\/[0-9]+.*/;
        this.ALLOWED_ORIGIN = "http://localhost:8000"; // TODO Move to config or environment variable.
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
        const pathname = this._parseUrlPathname(incomingMessage);

        if (method === "GET") {
            if (pathname === "/") {
                // GET /
                this._welcome(incomingMessage, serverResponse);
            } else if (pathname === "/notes") {
                // GET /notes
                this._getNotesList(incomingMessage, serverResponse);
            } else if (this.TEST_NOTE_ID_REGEXP.test(pathname)) {
                // GET /notes/{id}
                this._getNote(incomingMessage, serverResponse);
            } else {
                // Any other GET...
                this._handleNotFound(incomingMessage, serverResponse);
            }
        } else if (method === "POST" && pathname === "/notes") {
            // POST /notes
            this._createNote(incomingMessage, serverResponse);
        } else if (method === "PUT" && this.TEST_NOTE_ID_REGEXP.test(pathname)) {
            // PUT /notes/{id}
            this._updateNote(incomingMessage, serverResponse);
        } else if (method === "DELETE" && this.TEST_NOTE_ID_REGEXP.test(pathname)) {
            // DELETE /notes/{id}
            this._deleteNote(incomingMessage, serverResponse);
        } else if (method === "OPTIONS") {
            // OPTIONS *
            this._validateCrossOriginRequestSafety(incomingMessage, serverResponse);
        } else {
            // Anything else...
            this._handleNotFound(incomingMessage, serverResponse);
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

    _getNote(incomingMessage, serverResponse) {
        const pathname = this._parseUrlPathname(incomingMessage);
        const id = this._parseNoteId(pathname);
        this.notesController.get(id, 
            (response) => this._send(serverResponse, response));
    }

    _createNote(incomingMessage, serverResponse) {
        this._parseJsonBody(incomingMessage, serverResponse, 
            (contextualError, jsonBody) => {
                if (contextualError) {
                    this.errorController.internalServerError(
                        "error processing request for create note",
                        contextualError,
                        (response) => this._send(serverResponse, response));
                    return;
                }

                this.notesController.create(jsonBody,
                    (response) => this._send(serverResponse, response));
            }
        );
    }

    _updateNote(incomingMessage, serverResponse) {
        const pathname = this._parseUrlPathname(incomingMessage);
        const id = this._parseNoteId(pathname);
        this._parseJsonBody(incomingMessage, serverResponse,
            (contextualError, jsonBody) => {
                if (contextualError) {
                    this.errorController.internalServerError(
                        "error processing request for update note",
                        contextualError,
                        (response) => this._send(serverResponse, response));
                    return;
                }

                this.notesController.update(id, jsonBody,
                    (response) => this._send(serverResponse, response));
            }
        );
    }

    _parseJsonBody(incomingMessage, serverResponse, callback) {
        let stringBody = "";
        incomingMessage.on("error", (err) => {
            const contextualError = new this.ContextualError(
                "[Router] Failed to read incoming message body.", 
                err);
            callback(contextualError);
        });
        incomingMessage.on("data", function (chunk) {
            // TODO Add security on the maximum body size. ==> 400: Message is too long!
            stringBody += chunk;
        });
        incomingMessage.on("end", () => {
            if (stringBody.length === 0) {
                this.errorController.badRequest(
                    "empty body",
                    null,
                    (response) => this._send(serverResponse, response));
                return;
            }

            let jsonBody;
            try {
                jsonBody = JSON.parse(stringBody);
            } catch (err) {
                const contextualError = new this.ContextualError(
                    `[Router] Failed to parse JSON from incoming message body.\nReceived:\n${stringBody}`,
                    err);
                this.errorController.badRequest(
                    "bad JSON",
                    contextualError,
                    (response) => this._send(serverResponse, response));
                return;
            }
            callback(null, jsonBody);
        });
    }

    _deleteNote(incomingMessage, serverResponse) {
        const pathname = this._parseUrlPathname(incomingMessage);
        const id = this._parseNoteId(pathname);
        this.notesController.delete(id,
            (response) => this._send(serverResponse, response));
    }
    
    _parseNoteId(urlPathname) {
        // "/notes/1234" --> "1234"
        const id = urlPathname.substr("/notes/".length);
        return id;
    }

    _validateCrossOriginRequestSafety(incomingMessage, serverResponse) {
        const requestedMethod = incomingMessage.headers["access-control-request-method"];
        const requestedHeaders = incomingMessage.headers["access-control-request-headers"];

        const allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
        const allowedHeader = "Content-Type";
        if (allowedMethods.indexOf(requestedMethod) === -1) {
            serverResponse.statusCode = 401; // Unauthorized.
        } else if (requestedHeaders && requestedHeaders !== allowedHeader) {
            serverResponse.statusCode = 401; // Unauthorized.
        } else {
            serverResponse.statusCode = 204; // No content.
        }

        serverResponse.setHeader("Access-Control-Allow-Origin", this.ALLOWED_ORIGIN);
        serverResponse.setHeader("Access-Control-Allow-Methods", allowedMethods.join(", "));
        serverResponse.setHeader("Access-Control-Allow-Headers", allowedHeader);
        serverResponse.setHeader("Access-Control-Max-Age", "86400"); // 24 hours.
        serverResponse.end();
    }

    _handleNotFound(incomingMessage, serverResponse) {
        const pathname = this._parseUrlPathname(incomingMessage);
        const requestedResource = incomingMessage.method + " " + pathname;
        this.errorController.notFound(requestedResource, 
            (response) => this._send(serverResponse, response));
    }

    _parseUrlPathname(incomingMessage) {
        const url = this.URL.parse(incomingMessage.url);
        return url.pathname;
    }

    _send(serverResponse, response) {
        serverResponse.statusCode = response.statusCode;

        serverResponse.setHeader("Access-Control-Allow-Origin", this.ALLOWED_ORIGIN);
        serverResponse.setHeader("Content-Type", response.contentType);

        const stringData = response.content;
        serverResponse.setHeader("Content-Length", Buffer.byteLength(stringData));

        serverResponse.end(stringData);
    }
}

module.exports = Router;
