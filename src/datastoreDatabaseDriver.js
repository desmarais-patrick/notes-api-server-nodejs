const NOTE_KIND = "Note";

class DatastoreDatabaseDriver {
    /**
     * @param {object} options 
     * @param {function} options.ContextualError
     * @param {function} options.Datastore
     */
    constructor(options) {
        this.ContextualError = options.ContextualError;

        this.datastore = new options.Datastore();
    }

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
            callback(null, entities.map((e) => this._parseNote(e)));
        });
    }
    /**
     * @callback DatastoreDatabaseDriver~getNotesCallback
     * @param {Error|ContextualError} err
     * @param {object[]} parsedNotes
     */

    _parseNote(datastoreEntity) {
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

module.exports = DatastoreDatabaseDriver;
