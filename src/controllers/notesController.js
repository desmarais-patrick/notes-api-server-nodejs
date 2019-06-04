class NotesController {
    /**
     * 
     * @param {object} options 
     * @param {function} options.ContextualError
     * @param {function} options.ErrorResponse
     * @param {function} options.SuccessResponse
     * @param {string} options.environment
     * @param {DatastoreDatabaseDriver} options.databaseDriver
     */
    constructor(options) {
        this.ContextualError = options.ContextualError;
        this.ErrorResponse = options.ErrorResponse;
        this.SuccessResponse = options.SuccessResponse;

        this.environment = options.environment;
        this.databaseDriver = options.databaseDriver;
    }

    create(requestBody, callback) {
        callback(new Error("notesController.create [Not yet implemented]"));
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
                    if (this.environment === "development") {
                        message = message + ": " + contextError.toString();
                    }
                    const response = new this.ErrorResponse()
                        .setStatusCode(500)
                        .setMessage(message);
                    callback(response);
                    return;
                }

                // TODO Translate `notes` from a Model to JSON response 
                //      defined here.
                const response = new this.SuccessResponse()
                    .setType("Collection")
                    .setProperty("limit", listRequest.limit)
                    .setProperty("offset", listRequest.offset)
                    .setProperty("items", notes);
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
