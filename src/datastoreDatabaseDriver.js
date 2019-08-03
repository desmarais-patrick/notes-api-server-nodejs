const NOTE_KIND = "Note";
const DATASTORE_NOTE_DATE_PROPERTY_NAME = "date";

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
        const datastoreEntity = this.noteTranslator.format(note);
        const entityKey = datastoreEntity.key;
        this.datastore.save(datastoreEntity, (err) => {
            // When update, the identifier is already set.
            // When create, the identifier is filled upon response.
            // See test file with datastore in this project.
            const noteId = entityKey.id;

            if (err) {
                const contextError = new this.ContextualError(
                    `DatastoreDatabaseDriver failed to save note ${note.toString()}.`,
                    err
                );
                callback(contextError, noteId);
                return;
            }

            callback(null, noteId);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~saveCallback
     * @param {ContextualError} err
     * @param {string} noteId
     */

    /**
     * @param {ListRequest} listRequest
     * @param {DatastoreDatabaseDriver~getNotesCallback} callback 
     */
    getNotes(listRequest, callback) {
        const query = this.datastore.createQuery([NOTE_KIND])
            .limit(listRequest.limit)
            .offset(listRequest.offset)
            .order(DATASTORE_NOTE_DATE_PROPERTY_NAME, {
                descending: true,
            });
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

    /**
     * @param {number} id
     * @param {DatastoreDatabaseDriver~deleteNoteCallback} callback 
     */
    deleteNote(id, callback) {
        const key = this.datastore.key([NOTE_KIND, id]);
        this.datastore.delete(key, (err) => {
            if (err) {
                const contextError = new this.ContextualError(
                    `DatastoreDatabaseDriver failed to delete note '${id}'.`,
                    err
                );
                callback(contextError, null);
                return;
            }

            callback(null);
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~deleteNoteCallback
     * @param {ContextualError} err
     */
}

module.exports = DatastoreDatabaseDriver;
