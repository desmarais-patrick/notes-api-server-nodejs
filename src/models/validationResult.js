class ValidationResult {
    constructor() {}

    /**
     * @param {boolean} isValid
     * @returns {ValidationResult} For chaining. 
     */
    setIsValid(isValid) {
        this.isValid = isValid;
        return this;
    }

    /**
     * @param {string} reason 
     * @returns {ValidationResult} For chaining.
     */
    setReason(reason) {
        this.reason = reason;
        return this;
    }
}

module.exports = ValidationResult;
