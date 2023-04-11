class WorldManager {
    constructor(server, map) {
        this._server = server;
        this._map = map;
    }

    update() {

    }

    getServer() {
        return this._server;
    }

    getMap() {
        return this._map;
    }
}

export default WorldManager;