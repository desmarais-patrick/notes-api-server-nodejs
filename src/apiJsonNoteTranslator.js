class ApiJsonNoteTranslator {
    /**
     * @param {object} options
     * @param {function} options.Note
     * @param {function} options.ValidationResult
     */
    constructor(options) {
        this.Note = options.Note;
        this.ValidationResult = options.ValidationResult;
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
     * @returns {ValidationResult}
     */
    validate(apiJson) {
        const result = new ValidationResult();

        const id = apiJson.id;
        if (typeof id !== "string" && id !== null) {
            // `id` can be null when creating a new note.
            return result.setIsValid(false)
                .setReason("Invalid value for property `id`. Must be string or null.");
        }

        const date = apiJson.date;
        if (typeof date !== "string") {
            return result.setIsValid(false)
                .setReason("Missing value for property `date`.");
        }
        if (!ApiJsonNoteTranslator.DATE_REGEXP.test(date)) {
            return result.setIsValid(false)
                .setReason("Expected value for property `date` to have format: " +
                    "24-character-long, ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ).")
        }

        const text = apiJson.text;
        if (typeof text !== "string") {
            return result.setIsValid(false)
                .setReason("Missing value for property `text`.");
        }
        if (text.length >= ApiJsonNoteTranslator.TEXT_MAX_LENGTH) {
            return result.setIsValid(false)
                .setReason("Value *length* for property `text` exceeds " + 
                    ApiJsonNoteTranslator.TEXT_MAX_LENGTH);
        }

        return result.setIsValid(true);
    }

    /**
     * @param {object} apiJson 
     * @returns {Note}
     */
    read(apiJson) {
        const id = apiJson.id || null;
        const date = new Date(apiJson.date);
        return new this.Note()
            .setId(id)
            .setDate(date)
            .setText(apiJson.text);
    }
}
ApiJsonNoteTranslator.TRANSLATOR_ID = "api-json-note-translator";
ApiJsonNoteTranslator.API_JSON_TYPE = "Note";
ApiJsonNoteTranslator.DATE_REGEXP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
ApiJsonNoteTranslator.TEXT_MAX_LENGTH = 1000000;

module.exports = ApiJsonNoteTranslator;