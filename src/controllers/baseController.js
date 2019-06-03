const ENCODING = "UTF-8";

class BaseController {
    constructor() {}

    sendJson(statusCode, data, httpResponse) {
        httpResponse.statusCode = statusCode;
        httpResponse.setHeader("Content-Type", "application/json");

        const stringData = JSON.stringify(data);
        httpResponse.setHeader("Content-Length", Buffer.byteLength(stringData));
        httpResponse.write(stringData, ENCODING);

        httpResponse.end();
    }
}

module.exports = BaseController;
