const BaseController = require("./baseController");

class NotesController extends BaseController {
    constructor(options) {
        super(options);

        this.ContextualErrorClass = options.ContextualErrorClass;

        this.databaseDriver = options.databaseDriver;
    }

    create(requestBody, callback) {
        callback(new Error("notesController.create [Not yet implemented]"));
    }

    list(httpResponse, callback) {
        this.databaseDriver.getNotes((err, notes) => {
            if (err) {
                const contextError = new this.ContextualErrorClass(
                    null,
                    "NotesController failed to retrieve notes",
                    err
                );
                callback(contextError);
                return;
            }

            const data = {
                type: "Collection",
                items: notes,
                total: notes.length,
                limit: 10,
                offset: 0,
                next: null,
                previous: null
            };
            this.sendJson(200, data, httpResponse);
        });
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
}

module.exports = NotesController;
