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
        this.paramValidation = options.paramValidation;
        this.userValidation = options.userValidation;
    }

    /**
     * @param {object} apiJson 
     * @param {string} user 
     * @param {NotesController~responseCallback} callback 
     */
    create(apiJson, user, callback) {
        // Validate input.
        const validationResultForDate = this.noteValidation.validateDate(apiJson.date);
        if (!validationResultForDate.isValid) {
            this._badRequest(validationResultForDate.reason, callback);
            return;
        }

        const validationResultForText = this.noteValidation.validateText(apiJson.text);
        if (!validationResultForText.isValid) {
            this._badRequest(validationResultForText.reason, callback);
            return;
        }

        const validationResultForUser = this.userValidation.validate(user);
        if (!validationResultForUser.isValid) {
            this._badRequest(validationResultForUser.reason, callback);
            return;
        }

        // Translate to Note.
        const note = this.apiJsonNoteTranslator.read(apiJson, user);

        // Save to database.
        this.databaseDriver.save(note, (err, noteId) => {
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
                .setProperty("id", noteId);
            callback(response);
        });
    }

    /**
     * @param {GetNotesListRequest} request
     * @param {NotesController~responseCallback} callback 
     */
    list(request, callback) {
        let param, user, validationResult;

        param = request.limit;
        validationResult = this.paramValidation.validateLimit(param);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        param = request.offset;
        validationResult = this.paramValidation.validateOffset(param);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        user = request.user;
        validationResult = this.userValidation.validate(user);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        this.databaseDriver.getNotes(request,
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
                    .setProperty("limit", request.limit)
                    .setProperty("offset", request.offset)
                    .setProperty("items", apiJsonNotes);
                callback(response);
            }
        );
    }

    /**
     * @param {number} id 
     * @param {string} user 
     * @param {NotesController~responseCallback} callback 
     */
    get(id, user, callback) {
        // Validation.
        let validationResult;

        validationResult = this.noteValidation.validateId(id);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }
        const idAsNumber = parseInt(id, 10);

        validationResult = this.userValidation.validate(user);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        // Fetch note from database!
        this.databaseDriver.getNote(idAsNumber, user, 
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

    /**
     * @param {string} id 
     * @param {object} apiJson 
     * @param {NotesController~responseCallback} callback 
     */
    update(id, user, apiJson, callback) {
        // Validation.
        let validationResult;

        validationResult = this.noteValidation.validateId(id);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }
        const idAsNumber = parseInt(id, 10);

        validationResult = this.userValidation.validate(user);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        validationResult = this.noteValidation.validateDate(apiJson.date);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        validationResult = this.noteValidation.validateText(apiJson.text);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        // Translate to Note.
        const note = this.apiJsonNoteTranslator.read(apiJson, user);
        note.setId(idAsNumber);
        // TODO Validate if note exists before updating it.

        // Save to database.
        this.databaseDriver.save(note, (err, noteId) => {
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
                .setProperty("id", noteId);
            callback(response);
        });
    }

    /**
     * @param {string} id
     * @param {NotesController~responseCallback} callback 
     */
    delete(id, user, callback) {
        // Validation.
        let validationResult;

        validationResult = this.noteValidation.validateId(id);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }
        const idAsNumber = parseInt(id, 10);

        validationResult = this.userValidation.validate(user);
        if (!validationResult.isValid) {
            this._badRequest(validationResult.reason, callback);
            return;
        }

        // Make sure note belongs to this user.
        this.databaseDriver.getNote(idAsNumber, user, 
            (err, note) => {
                if (err) {
                    const contextMessage = [
                        "NotesController",
                        "failed to validate existence of note with id",
                        idAsNumber,
                        "for user", user
                    ].join(" ");
                    const contextError = new this.ContextualError(
                        contextMessage, err);
                
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

                // Delete note from datastore.
                this.databaseDriver.deleteNote(idAsNumber, (err) => {
                    if (err) {
                        const longMessage = [
                            "NotesController",
                            "failed to delete note with id", idAsNumber,
                            "for user", user
                        ].join(" ");
                        const contextError = new this.ContextualError(
                            longMessage, err);

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
                        .setType("NoteDeleted")
                        .setProperty("id", idAsNumber);
                    callback(response);
                });
            }
        );
    }

    /**
     * @callback NotesController~responseCallback
     * @param {SuccessResponse|ErrorResponse} response
     */

    _badRequest(reason, callback) {
        const response = new this.ErrorResponse()
            .setStatusCode(400)
            .setMessage(`Bad request: ${reason}`);
        setImmediate(function () { callback(response) });
    }
}

module.exports = NotesController;
