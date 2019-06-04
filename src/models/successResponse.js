class SuccessResponse {
    constructor() {
        this.statusCode = 200;
        this.type = null;
        this.data = {};
    }

    /**
     * 
     * @param {string} type 
     * @returns {SuccessResponse} For chaining.
     */
    setType(type) {
        this.type = type;
        return this;
    }

    /**
     * 
     * @param {string} key
     * @param {string|number|object|[]} withValue
     * @returns {SuccessResponse} For chaining.
     */
    setProperty(key, withValue) {
        this.data[key] = withValue;
        return this;
    }

    /**
     * @returns {string} Formatted response for sending over the wire.
     */
    toString() {
        const json = {
            type: this.type,
        };

        for (let key in this.data) {
            json[key] = this.data[key];
        }

        return JSON.stringify(json);
    }
}

module.exports = SuccessResponse;
