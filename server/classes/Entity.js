class Entity {
    constructor({manager, type, name, pos, height, width}) {
        this._manager = manager;

        this.type = type;
        this.name = name;
        this.pos = pos;
        this.height = height;
        this.width = width;
    }

    setPos(pos) {
        this.pos = pos;
    }

    move(pos) {
        this.pos[0] += pos[0];
        this.pos[1] += pos[1];
    }

    getName() {
        return this.name;
    }

    setHeight(height) {
        this.height = height;
    }

    kill() {
        this._manager.kill(this.name);
    }

    serialize() {
        return {
            type: this.type,
            name: this.name,
            pos: this.pos,
            height: this.height,
            width: this.width
        }
    }
}

export default Entity;