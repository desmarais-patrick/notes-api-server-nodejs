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

    /**
     * @param {object} apiJson 
     * @param {NotesController~responseCallback} callback 
     */
    create(apiJson, callback) {
        const validationResult = this.apiJsonNoteTranslator.validate(apiJson);
        if (!validationResult.isValid) {
            const response = new this.ErrorResponse()
                .setStatusCode(400)
                .setMessage(`Bad request: ${validationResult.reason}`);
            setImmediate(function () { callback(response) });
            return;
        }

        const note = this.apiJsonNoteTranslator.read(apiJson);
        this.databaseDriver.create(note, (err) => {
            if (err) {
                const contextError = new this.ContextualError(
                    "NotesController failed to create note", err);
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

            const response = new this.SuccessResponse()
                .setStatusCode(201)
                .setType("NoteCreated")
            callback(response);
        });
    }

    /**
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

    /**
     * @param {number} id 
     * @param {NotesController~responseCallback} callback 
     */
    get(id, callback) {
        this.databaseDriver.getNote(id, 
            (err, note) => {
                if (err) {
                    const contextError = new this.ContextualError(
                        `NotesController failed to retrieve note ${id}`, err);
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

                if (!note) {
                    const response = new this.ErrorResponse()
                        .setStatusCode(404)
                        .setMessage(`Note '${id}' cannot be found.`);
                    callback(response);
                    return;
                }

                const apiJsonNote = this.apiJsonNoteTranslator.format(note);
                const response = new this.SuccessResponse();
                for (let property in apiJsonNote) {
                    response.setProperty(property, apiJsonNote[property]);
                }
                callback(response);
            }
        );
    }

    update(id, apiJson, callback) {
        // Validate apiJson
        // Translate apiJson to note
        // Add id to note
        // Save note to datastore.
        console.log("Received id", id);
        console.log("Received apiJson", apiJson);
        const response = new this.ErrorResponse()
                .setStatusCode(500)
                .setMessage("notesController.update [Not yet implemented]");
        setImmediate(function () { callback(response) });
    }

    delete(id, callback) {
        // Delete note from datastore.
        console.log("Received id", id);
        const response = new this.ErrorResponse()
                .setStatusCode(500)
                .setMessage("notesController.delete [Not yet implemented]");
        setImmediate(function () { callback(response) });
    }

    /**
     * @callback NotesController~responseCallback
     * @param {SuccessResponse|ErrorResponse} response
     */
}

module.exports = NotesController;
