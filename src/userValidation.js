class UserValidation {
    /**
     * @param {object} options 
     * @param {function} options.ValidationResult
     */
    constructor(options) {
        this.ValidationResult = options.ValidationResult;
    }

    /**
     * @param {string} user ID as obtained from header.
     * @returns {ValidationResult}
     */
    validate(user) {
        const result = new this.ValidationResult();

        if (typeof user === "string" && user.length > 0 &&
            user.length <= UserValidation.USER_MAX_LENGTH) {
            
            result.setIsValid(true);
            return result;
        }

        result.setIsValid(false);

        let reason;

        if (typeof user === "undefined") {
            result.setReason("Missing user");
            return result;
        }

        if (typeof user !== "string") {
            reason = [
                "Expected user value to be string, but found type",
                typeof user
            ].join(" ");
            result.setReason(reason);
            return result;
        }

        if (user.length === 0) {
            reason = [
                "Expected user value to be of length greater than 0",
                "but found empty"
            ].join(" ");
            result.setReason(reason);
            return result;
        }

        if (user.length > UserValidation.USER_MAX_LENGTH) {
            reason = [
                "Expected user value to be of length lower than",
                UserValidation.USER_MAX_LENGTH,
                "but found length", user.length
            ].join(" ");
            result.setReason(reason);
            return result;
        }

        return result;
    }
}
UserValidation.USER_MAX_LENGTH = 100;

module.exports = UserValidation;
