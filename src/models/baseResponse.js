class BaseResponse {
    constructor() {
        this.statusCode = null;
    }

    /**
     * 
     * @param {number} statusCode 
     * @returns {BaseResponse} For chaining.
     */
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    /**
     * 
     * @param {http.ServerResponse} serverResponse 
     */
    send(serverResponse) {
        serverResponse.statusCode = this.statusCode;
        serverResponse.setHeader("Content-Type", "application/json");

        const stringData = JSON.stringify(this._formatJson());
        serverResponse.setHeader("Content-Length", 
            Buffer.byteLength(stringData));
        serverResponse.write(stringData, ENCODING);

        serverResponse.end();
    }

    _formatJson() {
        throw new Error("This method should be overridden in a child class.");
    }
}

module.exports = BaseResponse;
