class TextResponse {
    constructor() {
        this.statusCode = 200;
        this.contentType = "text/plain;charset=UTF-8";
        this.content = "";
    }

    setContent(content) {
        this.content = content;
        return this;
    }
}

module.exports = TextResponse;
