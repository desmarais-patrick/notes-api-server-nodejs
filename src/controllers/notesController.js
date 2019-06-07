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
     * @param {NoteValidation} options.noteValidation
     */
    constructor(options) {
        this.ContextualError = options.ContextualError;
        this.ErrorResponse = options.ErrorResponse;
        this.SuccessResponse = options.SuccessResponse;

        this.apiJsonNoteTranslator = options.apiJsonNoteTranslator;
        this.environment = options.environment;
        this.databaseDriver = options.databaseDriver;
        this.noteValidation = options.noteValidation;
    }

    /**
     * @param {object} apiJson 
     * @param {NotesController~responseCallback} callback 
     */
    create(apiJson, callback) {
        // Validate input.
        const validationResultForDate = this.noteValidation.validateDate(apiJson.date);
        if (!validationResultForDate.isValid) {
            this._badRequest(validationResultForDate, callback);
            return;
        }

        const validationResultForText = this.noteValidation.validateText(apiJson.text);
        if (!validationResultForText.isValid) {
            this._badRequest(validationResultForText, callback);
            return;
        }

        // Translate to Note.
        const note = this.apiJsonNoteTranslator.read(apiJson);

        // Save to database.
        this.databaseDriver.save(note, (err) => {
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
        // Validate id.
        const validationResult = this.noteValidation.validateId(id);
        if (!validationResult.isValid) {
            this._badRequest(validationResult, callback);
            return;
        }
        const idAsNumber = parseInt(id, 10);

        // Fetch note from database!
        this.databaseDriver.getNote(idAsNumber, 
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
        // Validate apiJson.
        const validationResultForId = this.noteValidation.validateId(id);
        if (!validationResultForId.isValid) {
            this._badRequest(validationResultForId, callback);
            return;
        }
        const idAsNumber = parseInt(id, 10);

        const validationResultForDate = this.noteValidation.validateDate(apiJson.date);
        if (!validationResultForDate.isValid) {
            this._badRequest(validationResultForDate, callback);
            return;
        }

        const validationResultForText = this.noteValidation.validateText(apiJson.text);
        if (!validationResultForText.isValid) {
            this._badRequest(validationResultForText, callback);
            return;
        }

        // Translate to Note.
        const note = this.apiJsonNoteTranslator.read(apiJson);
        note.setId(idAsNumber);

        // Save to database.
        this.databaseDriver.save(note, (err) => {
            if (err) {
                const contextError = new this.ContextualError(
                    "NotesController failed to update note", err);
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
                .setStatusCode(200)
                .setType("NoteUpdated")
                .setProperty("id", id);
            callback(response);
        });
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

    _badRequest(validationResult, callback) {
        const response = new this.ErrorResponse()
            .setStatusCode(400)
            .setMessage(`Bad request: ${validationResult.reason}`);
        setImmediate(function () { callback(response) });
    }
}

module.exports = NotesController;
