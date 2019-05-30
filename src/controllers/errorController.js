const {BaseController} = require("./baseController");

class ErrorController extends BaseController {
    constructor(options) {
        super(options);
        this.environment = options.environment;
    }

    badRequest(details, httpResponse) {
        const error = {
            type: "Error",
            code: 400,
            message: `Bad request: ${details}`
        };

        this.sendJson(400, error, httpResponse);
    }

    generalError(details, httpResponse) {
        let message = "General error";
        if (this.environment === "development") {
            message += errorDetails;
        }

        const error = {
            type: "Error",
            code: 500,
            message
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
    ErrorController
};
