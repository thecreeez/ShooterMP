import EntityManager from "./modules/EntityManager.js";
import PacketManager from "./modules/PacketManager.js";
import WorldManager from "./modules/WorldManager.js";

class Server {
    constructor(map) {
        this._packetManager = new PacketManager(this);
        this._entityManager = new EntityManager(this);
        
        this._worldManager = new WorldManager(this, map);

        this.defaultSpawnPosition = [3,3]
    }

    start(port) {
        this._packetManager.start(port);
    }

    getPacketManager() {
        return this._packetManager;
    }

    getEntityManager() {
        return this._entityManager;
    }

    getWorldManager() {
        return this._worldManager;
    }
}

export default Server;