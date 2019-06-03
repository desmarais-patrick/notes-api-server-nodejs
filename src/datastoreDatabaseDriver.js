const NOTE_KIND = "Note";

class DatastoreDatabaseDriver {
    /**
     * @param {object} options 
     * @param {function} options.ContextualErrorClass
     * @param {function} options.DatastoreClass
     */
    constructor(options) {
        this.ContextualErrorClass = options.ContextualErrorClass;

        this.datastore = new options.DatastoreClass();
    }

    /**
     * Retrieves notes from the database.
     * 
     * @param {DatastoreDatabaseDriver~getNotesCallback} callback 
     */
    getNotes(callback) {
        const query = this.datastore.createQuery([NOTE_KIND]).limit(10);
        this.datastore.runQuery(query, (err, entities) => {
            if (err) {
                const contextError = new this.ContextualErrorClass(
                    this.ContextualErrorClass.ERROR_TYPES.databaseError,
                    "DatastoreDatabaseDriver failed to run query to get notes.",
                    err
                );
                callback(contextError);
                return;
            }
            callback(null, entities.map((e) => this.parseNote(e)));
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~getNotesCallback
     * @param {Error|ContextualError} err
     * @param {object[]} parsedNotes
     */

    /**
     * @param {object} datastoreEntity 
     * @returns {object} Parsed note.
     */
    parseNote(datastoreEntity) {
        const meta = datastoreEntity[this.datastore.KEY];
        const id = meta.id;
        const type = meta.kind;

        return {
            type,
            id,
            text: datastoreEntity["text"],
            date: datastoreEntity["date"]
        };
    }
}

module.exports = {
    DatastoreDatabaseDriver
};
