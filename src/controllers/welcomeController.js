class WelcomeController {
    constructor(options) {
        this.TextResponse = options.TextResponse;
    }

    /**
     * @param {WelcomeController~responseCallback} callback 
     */
    welcome(callback) {
        const response = new this.TextResponse()

        const message = "Welcome to the Notes API! 📔" + "\n";
        message += "\n";
        message += "Available endpoints:" + "\n";
        message += "\n";
        message += " - GET `/notes`" + "\n";
        message += "\n";
        response.setContent(message);

        setImmediate(() => {
            callback(response);
        });
    }

    /**
     * @callback {WelcomeController~responseCallback}
     * @params {TextResponse} response
     */
}

module.exports = WelcomeController;
