const UPS = 60;

const GAME_EVENT_Y_IS_RAYS = false;
const GAME_EVENT_MAX_DRAWS_IS_1000 = true;

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

async function connect() {
    await GameInstance._packetManager.connect("localhost", 2020);
    console.log("connected!");
}

async function debugSend(message) {
    GameInstance._packetManager.send(message)
}

async function connect(ip, port) {
    if (!localStorage.getItem("username")) {
        return console.log("Невозможно подключиться к серверу, установите имя (setNickname('Имя'))")
    }

    try {
        await GameInstance._packetManager.connect(ip, port);
        GameInstance._packetManager.onConnect(() => {
            GameInstance._packetManager.send("handshake/" + localStorage.getItem("username"))
        })
    } catch (e) {
        console.error(e);
    }
}

function setNickname(newName) {
    localStorage.setItem("username", newName);
}