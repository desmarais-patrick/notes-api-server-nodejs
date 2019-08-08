class WelcomeController {
    constructor(options) {
        this.TextResponse = options.TextResponse;
    }

    /**
     * @param {WelcomeController~responseCallback} callback 
     */
    welcome(callback) {
        const response = new this.TextResponse()

        let message = [
            "Welcome to the Notes API! 📔", "\n",
            "\n",
            "Available endpoints:", "\n",
            "\n",
            " - GET `/notes`", "\n",
            " - POST `/notes` {body}", "\n",
            " - PUT `/notes/{id}` {body}", "\n",
            " - GET `/notes/{id}`", "\n",
            " - DELETE `/notes/{id}`", "\n",
            "\n",
            "Version: 0.1.1", "\n"
        ].join("");
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
