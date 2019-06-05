class Note {
    constructor() {
        this.id = null;
        this.date = null;
        this.text = "";
    }

    /**
     * @param {string|null} id 
     * @returns {Note} For chaining.
     */
    setId(id) {
        this.id = id;
        return this;
    }

    /**
     * @param {Date} date 
     * @returns {Note} For chaining.
     */
    setDate(date) {
        this.date = date;
        return this;
    }

    /**
     * @param {string} text
     * @returns {Note} For chaining.
     */
    setText(text) {
        this.text = text;
        return this;
    }
}

module.exports = Note;
