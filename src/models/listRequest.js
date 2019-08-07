class ListRequest {
    constructor() {
        this.originalLimit = null;
        this.limit = null;

        this.MIN_LIMIT = 1;
        this.MAX_LIMIT = 50;

        this.originalOffset = null;
        this.offset = null;

        this.MIN_OFFSET = 0;
        this.MAX_OFFSET = Number.MAX_VALUE;

        this.originalUser = null;
        this.user = null;
    }

    /**
     * @param {number} limit 
     * @returns {ListRequest} For chaining.
     */
    setLimit(limit) {
        this.originalLimit = limit;
        this.limit = this._parseIntValue(limit, this.MIN_LIMIT, this.MAX_LIMIT);

        return this;
    }

    /**
     * @returns {number}
     */
    getLimit() {
        return this.limit;
    }

    /**
     * @returns {boolean}
     */
    isLimitValid() {
        if (this.limit === null) {
            return false;
        }
        return true;
    }

    /**
     * @param {number} offset 
     * @returns {ListRequest} For chaining.
     */
    setOffset(offset) {
        this.originalOffset = offset;
        this.offset = this._parseIntValue(offset, this.MIN_OFFSET,
            this.MAX_OFFSET);
        return this;
    }

    /**
     * @returns {number}
     */
    getOffset() {
        return this.offset;
    }

    /**
     * @returns {boolean}
     */
    isOffsetValid() {
        if (this.offset === null) {
            return false;
        }
        return true;
    }

    _parseIntValue(value, min, max) {
        let valueAsNumber;
        if (typeof value === "number") {
            valueAsNumber = value;
        } else if (typeof value === "string") {
            try {
                valueAsNumber = parseInt(value, 10);
                if (isNaN(valueAsNumber) === true) {
                    return null;
                }
            } catch (parseError) {
                return null;
            }
        } else {
            return null;
        }

        if (valueAsNumber >= min && valueAsNumber <= max) {
            return valueAsNumber;
        }

        return null;
    }

    /**
     * @param {string} user 
     * @returns {ListRequest} For chaining.
     */
    setUser(user) {
        this.originalUser = user;
        if (typeof user === "string" && user.length > 0) {
            this.user = user;
        }
        return this;
    }

    /**
     * @returns {string}
     */
    getUser() {
        return this.user;
    }

    /**
     * @returns {boolean}
     */
    isUserValid() {
        if (this.user === null) {
            return false;
        }
        return true;
    }
}

module.exports = ListRequest;
