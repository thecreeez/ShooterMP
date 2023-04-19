class Logger {
    constructor(module) {
        this._module = module;
    }

    log(text) {
        this._log("log", this._module, text);
    }

    error(text) {
        this._log("error", this._module, text);
    }

    _log(type, module, text) {
        switch (type) {
            case "log": {
                console.log(`[${this._getTime()}] [${module}]: ${text}`);
                break;
            }

            case "error": {
                console.error(`[${this._getTime()}] [${module}]: ${text}`);
                break;
            }

            default: {
                console.error(`[${this._getTime()}] [LOG]: Неизвестный тип: ${type}`);
            }
        }
    }

    _getTime() {
        const d = new Date();

        return d.toLocaleTimeString().split(" ")[0];
    }
}

export default Logger;