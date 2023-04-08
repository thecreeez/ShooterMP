import PacketManager from "./modules/PacketManager.js";

class Server {
    constructor() {
        this._packetManager = new PacketManager(this);
    }

    start(port) {
        this._packetManager.start(port);
    }

    getPacketManager() {
        return this._packetManager;
    }
}

export default Server;