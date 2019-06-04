class Environment {
    constructor(options) {
        this.mode = this._parseNodeEnv(options.NODE_ENV);
    }

    _parseNodeEnv(value) {
        let mode;
        switch(value) {
            case "development":
                mode = Environment.MODES.development;
                break;
            case "demonstration":
                mode = Environment.MODES.demonstration;
                break;
            case "production":
                mode = Environment.MODES.production;
                break;
            default:
                console.log(`[Environment] Unrecognized NODE_ENV: ${value}. Default: production`);
                mode = Environment.MODES.production;
                break;
        }
        return mode;
    }

    isDevMode() {
        return this.mode === Environment.MODES.development;
    }
}
Environment.MODES = {
    development: "development",
    demonstration: "demonstration",
    production: "production"
};

module.exports = Environment;