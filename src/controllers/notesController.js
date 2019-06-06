class NotesController {
    /**
     * 
     * @param {object} options 
     * @param {function} options.ContextualError
     * @param {function} options.ErrorResponse
     * @param {function} options.SuccessResponse
     * 
     * @param {ApiJsonNoteTranslator} options.apiJsonNoteTranslator
     * @param {string} options.environment
     * @param {DatastoreDatabaseDriver} options.databaseDriver
     */
    constructor(options) {
        this.ContextualError = options.ContextualError;
        this.ErrorResponse = options.ErrorResponse;
        this.SuccessResponse = options.SuccessResponse;

        this.apiJsonNoteTranslator = options.apiJsonNoteTranslator;
        this.environment = options.environment;
        this.databaseDriver = options.databaseDriver;
    }

    create(apiJson, callback) {
        const validationResult = this.apiJsonNoteTranslator.validate(apiJson);
        if (!validationResult.isValid) {
            const response = new this.ErrorResponse()
                .setStatusCode(400)
                .setMessage(`Bad request: ${validationResult.reason}`);
            setImmediate(function () { callback(response) });
            return;
        }

        callback(new this.ErrorResponse()
            .setStatusCode(500)
            .setMessage("notesController.create [Rest not yet implemented 😊]"));
    }

    /**
     * 
     * @param {ListRequest} listRequest 
     * @param {NotesController~responseCallback} callback 
     */
    list(listRequest, callback) {
        this.databaseDriver.getNotes(listRequest,
            (err, notes) => {
                if (err) {
                    const contextError = new this.ContextualError(
                        "NotesController failed to retrieve notes", err);
                    let message = "General error";
                    if (this.environment.isDev()) {
                        message = message + ": " + contextError.toString();
                    }
                    const response = new this.ErrorResponse()
                        .setStatusCode(500)
                        .setMessage(message);
                    callback(response);
                    return;
                }

                const apiJsonNotes = notes.map(n => this.apiJsonNoteTranslator.format(n));
                const response = new this.SuccessResponse()
                    .setType("Collection")
                    .setProperty("limit", listRequest.limit)
                    .setProperty("offset", listRequest.offset)
                    .setProperty("items", apiJsonNotes);
                callback(response);
            }
        );
    }

    get(id, callback) {
        callback(new Error("notesController.get [Not yet implemented]"));
    }

    update(id, requestBody, callback) {
        callback(new Error("notesController.update [Not yet implemented]"));
    }

    delete(id, callback) {
        callback(new Error("notesController.delete [Not yet implemented]"));
    }

    /**
     * @callback NotesController~responseCallback
     * @param {SuccessResponse|ErrorResponse} response
     */
}

module.exports = NotesController;
