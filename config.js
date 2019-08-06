var config = {};

config.devLocal = {
    allowedOrigin: "http://localhost:8000"
};

config.prod = {
    allowedOrigin: "[ENTER FRONT-END URL HERE]"
};

module.exports = config;
