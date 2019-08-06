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
            case "production":
                mode = Environment.MODES.production;
                break;
            default:
                console.log(`[Environment] Unrecognized environment: '${value}'. Default: production`);
                mode = Environment.MODES.production;
                break;
        }
        return mode;
    }

    isDev() {
        return (this.mode === Environment.MODES.development);
    }

    toString() {
        return this.mode;
    }
}
Environment.MODES = {
    development: "development",
    production: "production"
};

module.exports = Environment;
