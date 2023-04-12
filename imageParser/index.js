const Jimp = require("jimp");

// open a file called "lenna.png"
Jimp.read("toParse.png", (err, texture) => {
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

    console.log(JSON.stringify(out));
});