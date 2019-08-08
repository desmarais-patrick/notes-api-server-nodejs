class ParameterValidation {
    /**
     * @param {object} options 
     * @param {function} options.ValidationResult
     */
    constructor(options) {
        this.ValidationResult = options.ValidationResult;
    }

    /**
     * @param {string} limit Limit as obtained from query parameter.
     * @returns {ValidationResult}
     */
    validateLimit(limit) {
        return this._validateNumericParameter(limit,
            ParameterValidation.LIMIT_MIN, ParameterValidation.LIMIT_MAX);
    }

    /**
     * @param {string} offset Offset as obtained from query parameter.
     * @returns {ValidationResult}
     */
    validateOffset(offset) {
        return this._validateNumericParameter(offset,
            ParameterValidation.OFFSET_MIN, ParameterValidation.OFFSET_MAX);
    }

    _validateNumericParameter(value, min, max) {
        const result = new this.ValidationResult();

        const intValue = this._parseIntValue(value, min, max);
        if (intValue !== null) {
            result.setIsValid(true);
            return result;
        }

        result.setIsValid(false);

        let reason;

        if (typeof limit !== "number" && typeof limit !== "string") {
            reason = [
                "Expected value to be string, but found type",
                typeof limit
            ].join(" ");
            result.setReason(reason);
            return result;
        }

        reason = [
            "Expected value to be (parsable) number between [",
            ParameterValidation.LIMIT_MIN,
            ",",
            ParameterValidation.LIMIT_MAX,
            "], but found '", limit, "'"
        ].join("");
        result.setReason(reason);
        return result;
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
}
ParameterValidation.LIMIT_MIN = 1;
ParameterValidation.LIMIT_MAX = 50;
ParameterValidation.OFFSET_MIN = 0;
ParameterValidation.OFFSET_MAX = Number.MAX_VALUE;

module.exports = ParameterValidation;
