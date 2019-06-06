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
        this.MATCH_NOTE_ID_REGEXP = /^\/notes\/([0-9]+)(.*)$/;
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

        if (method === "GET") {
            if (urlPath === "/") {
                // GET /
                this._welcome(incomingMessage, serverResponse);
            } else if (urlPath === "/notes") {
                // GET /notes
                this._getNotesList(incomingMessage, serverResponse);
            } else if (this.TEST_NOTE_ID_REGEXP.test(urlPath)) {
                // GET /notes/{id}
                this._getNote(incomingMessage, serverResponse);
            }
        } else if (method === "POST" && urlPath === "/notes") {
            // POST /notes
            this._createNote(incomingMessage, serverResponse);
        } else if (method === "PUT" && this.TEST_NOTE_ID_REGEXP.test(urlPath)) {
            // PUT /notes/{id}
            this._updateNote(incomingMessage, serverResponse);
        } else if (method === "DELETE" && this.TEST_NOTE_ID_REGEXP.test(urlPath)) {
            // DELETE /notes/{id}
            this._deleteNote(incomingMessage, serverResponse);
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
        const urlPath = this._parseUrlPath(incomingMessage);
        const id = this._parseNoteId(urlPath);
        if (id === null) {
            this._handleInvalidNoteId(incomingMessage, serverResponse);
            return;
        }

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
        const urlPath = this._parseUrlPath(incomingMessage);
        const id = this._parseNoteId(urlPath);
        if (id === null) {
            this._handleInvalidNoteId(incomingMessage, serverResponse);
            return;
        }

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
        const urlPath = this._parseUrlPath(incomingMessage);
        const id = this._parseNoteId(urlPath);
        if (id === null) {
            this._handleInvalidNoteId(incomingMessage, serverResponse);
            return;
        }

        this.notesController.delete(id,
            (response) => this._send(serverResponse, response));
    }
    
    _parseNoteId(urlPath) {
        let id = null;

        const match = this.MATCH_NOTE_ID_REGEXP.exec(urlPath);
        const potentialId = match[1];
        const potentialError = match[2];
        if (potentialError.length === 0) {
            id = parseInt(potentialId, 10);
        }

        return id;
    }

    _handleInvalidNoteId(incomingMessage, serverResponse) {
        const urlPath = this._parseUrlPath(incomingMessage);
        this.errorController.badRequest(
            `invalid \`id\` in (\`/notes/{id}\`): '${urlPath}'`,
            null,
            (response) => this._send(serverResponse, response));
    }

    _handleNotFound(incomingMessage, serverResponse) {
        const requestedResource = incomingMessage.method + " " + this._parseUrlPath(incomingMessage);
        this.errorController.notFound(requestedResource, 
            (response) => this._send(serverResponse, response));
    }

    _parseUrlPath(incomingMessage) {
        const url = this.URL.parse(incomingMessage.url);
        return url.pathname;
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
