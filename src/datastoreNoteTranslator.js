class DatastoreNoteTranslator {
    /**
     * @param {object} options 
     * @param {function} options.Note
     * @param {Datastore} options.datastore
     */
    constructor(options) {
        this.Note = options.Note;
        this.datastore = options.datastore;
    }

    /**
     * @param {Note} note 
     * @param {object} Datastore entity.
     */
    format(note) {
        const key = this._formatKey(note);
        const data = this._formatData(note);

        return {
            key,
            data
        }
    }

    _formatKey(note) {
        let key, idAsInt;

        const noteId = note.id;
        if (noteId === null) {
            // Let Datastore generate the key!
            // TODO: Consider calling allocateIds() and its usefulness in batching or creating multiple objects at once.
            key = this.datastore.key(DatastoreNoteTranslator.DATASTORE_KIND);
        } else {
            try {
                idAsInt = parseInt(noteId, 10);
            } catch (err) {
                console.log("Error parsing number out of ID (maybe name):", idAsInt);
                idAsInt = noteId; // Returning as is, hoping it's in the database as a name. :s
            }
            key = this.datastore.key([DatastoreNoteTranslator.DATASTORE_KIND, idAsInt]);
        }
        
        return key;
    }

    _formatData(note) {
        var date = this._formatDataProperty(
            DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.DATE,
            note.date);
        var text = this._formatDataProperty(
            DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.TEXT,
            note.text);
        return [date, text];
    }

    _formatDataProperty(propertyName, noteValue) {
        const indexedProps = DatastoreNoteTranslator.DATASTORE_KIND_INDEXED_PROPERTIES;
        return {
            name: propertyName,
            value: noteValue,
            excludeFromIndexes: (indexedProps.indexOf(propertyName) === -1)
        }
    }

    /**
     * @param {object} datastoreEntity 
     * @returns {Note}
     */
    read(datastoreEntity) {
        const id = this._readId(datastoreEntity);
        const date = this._readProperty(datastoreEntity,
            DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.DATE);
        const text = this._readProperty(datastoreEntity,
            DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.TEXT);

        return new this.Note()
            .setId(id)
            .setDate(date)
            .setText(text);
    }

    _readId(datastoreEntity) {
        const entityKeyPropertyName = this.datastore.KEY;
        const meta = datastoreEntity[entityKeyPropertyName];
        let id = meta.id;

        if (typeof id === "undefined") {
            if (typeof meta.name === "string") {
                console.log("Datastore entity has name instead of numeric ID.",
                    "Name:", meta.name);
                id = meta.name; // Returning the name, so at least we can refer back to it. :s
            } else {
                console.log("Datastore entity doesn't have ID or name!",
                    datastoreEntity);
                id = null;
            }
        }

        return id;
    }

    _readProperty(datastoreEntity, propertyName) {
        const value = datastoreEntity[propertyName];
        return value;
    }
}
DatastoreNoteTranslator.TRANSLATOR_ID = "datastore-note-translator";
DatastoreNoteTranslator.DATASTORE_KIND = "Note";
DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES = {
    DATE: "date",
    TEXT: "text"
};
DatastoreNoteTranslator.DATASTORE_KIND_INDEXED_PROPERTIES = [
    DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.DATE
];

module.exports = DatastoreNoteTranslator;
