import Logger from "./modules/Logger.js";
import EntityManager from "./modules/EntityManager.js";
import PacketManager from "./modules/PacketManager.js";
import WorldManager from "./modules/WorldManager.js";
import MapLoader from "./modules/MapLoader.js";

let logger = new Logger("Server");

class Server {
    constructor() {
        logger.log("Server is loading...");

        this._packetManager = new PacketManager(this, new Logger("PacketManager"));
        this._entityManager = new EntityManager(this, new Logger("EntityManager"));
        this._mapLoader = new MapLoader(this, new Logger("MapLoader"))
        this._worldManager = new WorldManager(this, this._mapLoader.load(), new Logger("WorldManager"));

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

    getMapLoader() {
        return this._mapLoader;
    }
}

export default Server;