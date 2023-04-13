const UPS = 60;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;

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

function sendMessage(message) {
    if (GameInstance._packetManager._state != CONNECT_STATE.OPENED)
        return GameInstance.getLoggerRenderer().log("Chat", "You can't send message without server", LOG_TYPE.ERROR);

    GameInstance._packetManager.send("chat/" + message);
}