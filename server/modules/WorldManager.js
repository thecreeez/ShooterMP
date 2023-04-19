class WorldManager {
    constructor(server, map, logger) {
        this._server = server;
        this._logger = logger;
        
        this.name = map.name;
        this.author = map.author;
        this.maxPlayers = map.maxPlayers;
        this.spawnPositions = map.spawnPositions;

        this.tiles = map.tiles;

        logger.log("Loaded map "+this.name+" by " + this.author)
    }

    update() {

    }

    getServer() {
        return this._server;
    }

    getTiles() {
        return this.tiles;
    }

    getName() {
        return this.name;
    }

    getAuthor() {
        return this.author;
    }

    getSpawnPosition() {
        return this.spawnPositions[getRandomInt(0, this.spawnPositions.length - 1)];
    }

    getMaxPlayers() {
        return this.maxPlayers;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default WorldManager;