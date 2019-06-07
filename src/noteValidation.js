class NoteValidation {
    /**
     * @param {object} options 
     * @param {function} options.ValidationResult
     */
    constructor(options) {
        this.ValidationResult = options.ValidationResult;
    }

    /**
     * @param {string} id ID as parsed from URL.
     * @returns {ValidationResult}
     */
    validateId(id) {
        const result = new this.ValidationResult();

        // Required!
        if (typeof id === "undefined") {
            result.setIsValid(false)
                  .setReason("missing value");
            return result;
        }

        // Type: string!
        if (typeof id !== "string") {
            result.setIsValid(false)
                  .setReason("value must be string");
            return result;
        }

        // Integer-like, starting with 1!
        if (!/^[1-9][0-9]*$/.test(id)) {
            result.setIsValid(false)
                  .setReason("value does not represent a valid integer");
            return result;
        }

        result.setIsValid(true);
        return result;
    }

    /**
     * @param {string} date Date as parsed from JSON body.
     * @returns {ValidationResult}
     */
    validateDate(date) {
        const result = new this.ValidationResult();

        // Required!
        if (typeof date === "undefined") {
            result.setIsValid(false)
                  .setReason("missing value for property `date`.");
            return result;
        }

        // Type: string!
        if (typeof date !== "string") {
            result.setIsValid(false)
                  .setReason("value for property `date` must be string.");
            return result;
        }

        // ISO-8601 format!
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
            result.setIsValid(false)
                  .setReason("expected value for property `date` to have format: " +
                    "24-character-long, ISO-8601 string " +
                    " YYYY-MM-DDTHH:mm:ss.sssZ (ex. 2019-06-07T11:55:00.000Z).");
            return result;
        }

        result.setIsValid(true);
        return result;
    }

    /**
     * @param {string} text Text as parsed from JSON body.
     * @returns {ValidationResult}
     */
    validateText(text) {
        const result = new this.ValidationResult();

        // Required!
        if (typeof text === "undefined") {
            result.setIsValid(false)
                  .setReason("missing value for property `text`.");
            return result;
        }

        // Type: string!
        if (typeof text !== "string") {
            result.setIsValid(false)
                  .setReason("value for property `text` must be string.");
            return result;
        }

        // Max length!
        if (text.length >= NoteValidation.TEXT_MAX_LENGTH) {
            result.setIsValid(false)
                  .setReason("value *length* for property `text` exceeds " + 
                  NoteValidation.TEXT_MAX_LENGTH + " characters.");
            return result;
        }

        result.setIsValid(true);
        return result;
    }
}
NoteValidation.TEXT_MAX_LENGTH = 1000000;

module.exports = NoteValidation;
