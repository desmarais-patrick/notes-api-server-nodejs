class SuccessResponse {
    constructor() {
        this.contentType = "application/json;charset=UTF-8";
        this.statusCode = 200;
        this.type = null;
        this.data = {};
    }

    /**
     * @param {number} statusCode 
     * @returns {SuccessResponse} For chaining.
     */
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
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
        // TODO Add assertion: "type" cannot be the key!
        this.data[key] = withValue;
        return this;
    }

    get content() {
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
