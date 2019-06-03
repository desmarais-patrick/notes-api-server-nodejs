class ListRequest {
    constructor() {
        this.offset = 0;
        this.limit = 1;
    }

    /**
     * 
     * @param {number} limit 
     * @returns {ListRequest} For chaining.
     */
    setLimit(limit) {
        this.limit = limit;
        return this;
    }

    /**
     * 
     * @param {number} offset 
     * @returns {ListRequest} For chaining.
     */
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
}

module.exports = ListRequest;
