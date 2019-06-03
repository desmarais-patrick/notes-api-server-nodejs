const BaseResponse = require("./baseResponse");

class SuccessResponse extends BaseResponse {
    constructor() {
        super();
        this.setStatusCode(200);
        this.data = {};
    }

    /**
     * 
     * @param {string} type 
     * @returns {BaseResponse} For chaining.
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

    _formatJson() {
        const json = {
            type: this.type,
        };

        for (let key in this.data) {
            json[key] = this.data[key];
        }

        return json;
    }
}

module.exports = SuccessResponse;
