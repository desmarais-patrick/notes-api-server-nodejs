class WelcomeController {
    constructor(options) {
        this.TextResponse = options.TextResponse;
    }

    /**
     * @param {WelcomeController~responseCallback} callback 
     */
    welcome(callback) {
        const response = new this.TextResponse()

        let message = "Welcome to the Notes API! 📔" + "\n";
        message += "\n";
        message += "Available endpoints:" + "\n";
        message += "\n";
        message += " - GET `/notes`" + "\n";
        message += " - POST `/notes` {body}" + "\n";
        message += " - PUT `/notes/{id}` {body}" + "\n";
        message += " - GET `/notes/{id}`" + "\n";
        message += " - DELETE `/notes/{id}`" + "\n";
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
