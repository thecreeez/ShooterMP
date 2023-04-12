import Entity from "./Entity.js";

class EntityPlayer extends Entity {
    constructor(manager, name, connection, pos) {
        super({
            manager: manager,
            type: "player",
            name: name,
            pos: pos,
            height: 200,
            width: 200
        })
        this._connection = connection;
    }

    serialize() {
        let entitySerialize = super.serialize();

        return entitySerialize;
    }

    sendPacket(packet) {
        if (!this._connection)
            return;

        this._connection.write(packet);
    }
}

export default EntityPlayer;