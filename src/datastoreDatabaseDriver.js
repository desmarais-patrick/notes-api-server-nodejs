const NOTE_KIND = "Note";

class DatastoreDatabaseDriver {
    constructor(options) {
        this.ContextualErrorClass = options.ContextualErrorClass;

        this.datastore = new options.DatastoreClass();
    }

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
