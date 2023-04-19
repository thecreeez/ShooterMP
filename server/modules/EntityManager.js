import EntityPlayer from "../classes/EntityPlayer.js";

class EntityManager {
    constructor(server, logger) {
        this._server = server;
        this._logger = logger;
        this._entities = new Map();
    }

    update() {

    }

    getServer() {
        return this._server;
    }

    getEntity(name) {
        return this._entities.get(name)
    }

    connectPlayer(name, connection) {
        let player = new EntityPlayer(this, name, connection, this._server.getWorldManager().getSpawnPosition());
        this._entities.set(name, player);
        this._logger.log("Player "+name+" joined the game.")

        return player;
    }

    disconnect(connId) {
        for (let entity of this._entities) {
            if (entity[1]._connection && entity[1]._connection.id == connId) {
                this._logger.log("Player " + entity[0] + " disconnected from game.")
                this._entities.delete(entity[0])

                this.getPlayers().forEach((player) => {
                    player.sendPacket("event/disconnect/"+JSON.stringify(entity[1].serialize()))
                })
            }
        }
    }

    getPlayers() {
        let players = [];

        for (let entity of this._entities) {
            if (entity[1].type == "player") {
                players.push(entity[1]);
            }
        }
        return players;
    }

    getPlayerByConnection(conn) {
        let out = null;

        for (let entity of this._entities) {
            if (entity[1].type == "player" && entity[1]._connection && entity[1]._connection.id == conn.id) {
                out = entity[1];
            }
        }

        return out;
    }

    getSerializedEntities({ except }) {
        let out = [];

        for (let entity of this._entities) {
            if (!except || except != entity[0])
                out.push(entity[1].serialize());
        }
        return out;
    }
}

export default EntityManager;