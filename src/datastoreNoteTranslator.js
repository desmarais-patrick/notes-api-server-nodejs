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
     * @param {object} Datastore document.
     */
    format(note) {
        let key;

        if (note.id !== null) {
            // Existing notes have a key compounded with their KIND.
            key = this.datastore.key([DatastoreNoteTranslator.DATASTORE_KIND, note.id]);
        } else {
            // New note shall receive a new key.
            key = this.datastore.key(DatastoreNoteTranslator.DATASTORE_KIND);
        }

        return {
            key,
            data: [
                this._formatDataProperty(
                    DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.DATE,
                    note.date),
                this._formatDataProperty(
                    DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.TEXT,
                    note.text)
            ]
        }
    }

    _formatDataProperty(propertyName, noteValue) {
        const indexedProperties = DatastoreNoteTranslator.DATASTORE_KIND_INDEXED_PROPERTIES;
        const excludeFromIndexes = (indexedProperties.indexOf(propertyName) !== -1);
        return {
            name: propertyName,
            value: noteValue,
            excludeFromIndexes
        }
    }

    /**
     * @param {object} datastoreDocument 
     * @returns {Note}
     */
    read(datastoreDocument) {
        const meta = datastoreDocument[this.datastore.KEY];
        const date = datastoreDocument[DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.DATE];
        const text = datastoreDocument[DatastoreNoteTranslator.DATASTORE_KIND_PROPERTIES.TEXT];
        return new this.Note()
            .setId(meta.id)
            .setDate(date)
            .setText(text);
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
