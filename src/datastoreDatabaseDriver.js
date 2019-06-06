const NOTE_KIND = "Note";

class DatastoreDatabaseDriver {
    /**
     * @param {object} options 
     * @param {function} options.ContextualError
     * @param {Datastore} options.datastore
     * @param {DatastoreNoteTranslator} options.datastoreNoteTranslator
     */
    constructor(options) {
        this.ContextualError = options.ContextualError;

        this.datastore = options.datastore;
        this.noteTranslator = options.datastoreNoteTranslator;
    }

    /**
     * @param {Note} note 
     * @param {DatastoreDatabaseDriver~createCallback} callback 
     */
    create(note, callback) {
        const datastoreDocument = this.noteTranslator.format(note);
        this.datastore.save(datastoreDocument, (err) => {
            if (err) {
                const contextError = new this.ContextualError(
                    "DatastoreDatabaseDriver failed to save new note.",
                    err
                );
                callback(contextError);
                return;
            }

            callback(null);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~createCallback
     * @param {ContextualError} err
     */

    /**
     * @param {ListRequest} listRequest
     * @param {DatastoreDatabaseDriver~getNotesCallback} callback 
     */
    getNotes(listRequest, callback) {
        const query = this.datastore.createQuery([NOTE_KIND])
            .limit(listRequest.limit)
            .offset(listRequest.offset);
        this.datastore.runQuery(query, (err, entities) => {
            if (err) {
                const contextError = new this.ContextualError(
                    "DatastoreDatabaseDriver failed to run query to get notes.",
                    err
                );
                callback(contextError);
                return;
            }
            const notes = entities.map(e => this.noteTranslator.read(e));
            callback(null, notes);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~getNotesCallback
     * @param {ContextualError} err
     * @param {Note[]} parsedNotes
     */
}

module.exports = DatastoreDatabaseDriver;
