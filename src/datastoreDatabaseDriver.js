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
     * @param {DatastoreDatabaseDriver~saveCallback} callback 
     */
    save(note, callback) {
        const datastoreDocument = this.noteTranslator.format(note);
        this.datastore.save(datastoreDocument, (err) => {
            if (err) {
                const contextError = new this.ContextualError(
                    `DatastoreDatabaseDriver failed to save note ${note.toString()}.`,
                    err
                );
                callback(contextError);
                return;
            }

            callback(null);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~saveCallback
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

    /**
     * @param {number} id
     * @param {DatastoreDatabaseDriver~getNoteCallback} callback 
     */
    getNote(id, callback) {
        const key = this.datastore.key([NOTE_KIND, id]);
        this.datastore.get(key, (err, entity) => {
            if (err) {
                const contextError = new this.ContextualError(
                    `DatastoreDatabaseDriver failed to get note '${id}'.`,
                    err
                );
                callback(contextError, null);
                return;
            }
            
            if (!entity) {
                callback(null, null);
                return;
            }

            const note = this.noteTranslator.read(entity);
            callback(null, note);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~getNoteCallback
     * @param {ContextualError} err
     * @param {Note} note
     */
}

module.exports = DatastoreDatabaseDriver;
