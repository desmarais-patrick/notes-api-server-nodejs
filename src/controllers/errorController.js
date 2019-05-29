const {BaseController} = require("./baseController");

class ErrorController extends BaseController {
    constructor(options) {
        super(options);
        this.environment = options.environment;
    }

    badRequest(details, httpResponse) {
        const message = {
            type: "Error",
            code: 400,
            message: `Bad request, details: (${details}).`
        };

        this.sendJson(400, message, httpResponse);
    }

    generalError(errorType, errorDetails, httpResponse) {
        let message = "General error";
        if (this.environment === "development") {
            message += ` [${errorType}]: ${errorDetails}`;
        }

        const error = {
            type: "Error",
            code: 500,
            message: message
        };

        this.sendJson(500, error, httpResponse);
    }

    notFound(invalidPathName, httpResponse) {
        const message = {
            type: "Error",
            code: 404,
            message: `Resource ${invalidPathName} not found.`
        };

        this.sendJson(404, message, httpResponse);
    }
}

module.exports = {
    ErrorController: ErrorController
};
