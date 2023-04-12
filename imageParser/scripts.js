let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let img = document.getElementById("toParse");
img.crossOrigin = "Anonymous"

img.onload = (ev) => {
    ctx.drawImage(img, 0, 0)

    let data = ctx.getImageData(0, 0, 16, 16)

    let out = [];
    for (let i = 0; i < 16; i++) {
        let line = []
        for (let j = 0; j < 16; j++) {
            let pixel = [Math.pow(data.data[j * 16 + i + 0], 2.2), Math.pow(data.data[j * 16 + i + 1], 2.2), Math.pow(data.data[j * 16 + i + 2], 2.2)]
            line.push(pixel);
        }
        out.push(line);
    }

    console.log(JSON.stringify(out))
}


