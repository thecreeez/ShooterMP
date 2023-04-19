const ERROR_WALL_TEXTURE = [[{ "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }], [{ "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }], [{ "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }], [{ "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }], [{ "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }], [{ "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }], [{ "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }], [{ "r": 165, "g": 0, "b": 255 }, { "r": 165, "g": 0, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }, { "r": 168, "g": 1, "b": 255 }, { "r": 168, "g": 1, "b": 255 }, { "r": 0, "g": 0, "b": 0 }, { "r": 0, "g": 0, "b": 0 }]]

const ENTITIES_TEXTURES = {
    player: "assets/player.png"
}

class TextureManager {
    constructor(game) {
        this._game = game;
        this._wallsTextures = [0];

        this.load();
    }

    setTexture(id, data) {
        this._wallsTextures[id] = data;
    }

    load() {
        this._entitiesTextures = this._loadEntitiesTextures();
    }

    _loadEntitiesTextures() {
        return {
            player: this._loadImage(ENTITIES_TEXTURES.player) 
        }
    }

    _loadImage(src) {
        let img = document.createElement("img");
        img.src = src;

        return img;
    }

    getWallTexture(id) {
        if (this._wallsTextures.length <= id)
            return ERROR_WALL_TEXTURE;

        return this._wallsTextures[id];
    }

    getEntityTexture(type) {
        return this._entitiesTextures[type];
    }
}