const url = require("url");
const {ContextualError, ERROR_TYPES} = require("./utilities/contextualError");

class Router {
    constructor(options) {
        this.errorController = options.errorController;
        this.notesController = options.notesController;
    }

    route(incomingMessage, httpResponse) {
        const messageUrl = url.parse(incomingMessage.url);

        if (messageUrl.pathname === "/") {
            this.notesController.list(httpResponse);
        } else {
            this.errorController.notFound(messageUrl.pathname, httpResponse);
        }
    }
}

module.exports = {
    Router: Router
};
