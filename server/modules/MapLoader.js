import fs from 'fs';
import Jimp from "jimp";

class MapLoader {
    constructor(server, logger) {
        this._server = server;
        this._logger = logger;

        this.textures = [0];
    }

    load() {
        const properties = JSON.parse(fs.readFileSync("./map/properties.json"));
        const tiles = JSON.parse(fs.readFileSync("./map/tiles.json"));
        
        properties.textures.forEach((texture) => {
            this._loadTexture(texture+".png");
        })

        return {
            name: properties.name,
            author: properties.author,
            maxPlayers: properties.maxPlayers,
            spawnPositions: properties.spawnPositions,

            tiles: tiles
        }
    }

    getTexture(index) {
        return this.textures[index];
    }

    getTexturesLength() {
        return this.textures.length;
    }

    async _loadTexture(name) {
        Jimp.read("./map/textures/"+name, (err, texture) => {
            if (err) throw err;

            let width = texture.getWidth();
            let height = texture.getHeight();

            let out = [];

            for (let i = 0; i < height; i++) {
                let row = [];

                for (let j = 0; j < width; j++) {
                    let rgba = Jimp.intToRGBA(texture.getPixelColor(j, i));
                    delete rgba.a;
                    row.push(rgba);
                }

                out.push(row);
            }

            this.textures.push(out);
        });
    }
}

export default MapLoader;