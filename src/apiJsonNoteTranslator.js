class ApiJsonNoteTranslator {
    /**
     * @param {object} options
     * @param {function} options.Note
     */
    constructor(options) {
        this.Note = options.Note;
    }

    /**
     * @param {Note} note 
     * @returns {object} API data.
     */
    format(note) {
        const date = note.date.toISOString();
        return {
            // Meta.
            type: ApiJsonNoteTranslator.API_JSON_TYPE,
            id: note.id,
            // Properties.
            date,
            text: note.text
        }
    }

    /**
     * @param {object} apiJson 
     * @returns {Note}
     */
    read(apiJson) {
        const date = new Date(apiJson.date);
        return new this.Note()
            .setDate(date)
            .setText(apiJson.text);
    }
}
ApiJsonNoteTranslator.TRANSLATOR_ID = "api-json-note-translator";
ApiJsonNoteTranslator.API_JSON_TYPE = "Note";

module.exports = ApiJsonNoteTranslator;
