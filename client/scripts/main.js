const UPS = 60;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GameInstance = new Game();
let ticks = 0;

window.onload = () => {
    load();

    LOOPS["update"] = setInterval(update, 1000 / 60)
    LOOPS["counter"] = setInterval(count, 500);
}

const LOOPS = {

}
update();
function load() {
    console.log("Load!")
}

function update() {
    GameInstance.update();
    GameInstance.render();
}

function count() {
    GameInstance.count();
}