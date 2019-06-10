class Note {
    constructor() {
        this.id = null;
        this.date = null;
        this.text = "";
    }

    /**
     * @param {number|null} id 
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

    /**
     * @returns {string}
     */
    toString() {
        let id;
        if (typeof this.id === "number") {
            id = id.toString();
        } else {
            id = this.id + "";
        }

        let date;
        if (typeof this.date === "object" && this.date.constructor.name === "Date") {
            date = this.date.toISOString();
        } else {
            date = this.date + "";
        }

        let text;
        if (typeof this.text === "string" && this.text.length > 7) {
            text = this.text.substring(0, 7) + "...";
        } else {
            text = this.text + "";
        }

        return `Note (id=${id}; date=${date}; text=${text})`
    }
}

module.exports = Note;
