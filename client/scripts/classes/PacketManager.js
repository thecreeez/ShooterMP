class PacketManager {
    constructor(game) {
        this._game = game;

        this._sockjs = null;
        this._state = CONNECT_STATE.CLOSED;

        this.packets = {};
        this.onConnectFunctions = [];
    }

    connect(ip, port) {
        this._state = CONNECT_STATE.AWAITING;

        this._sockjs = new SockJS("http://" + ip + ":" + port + "/socket", null, { timeout: 10000 });
        this._sockjs.onopen = (e) => {
            this._state = CONNECT_STATE.OPENED;
            this.onConnectFunctions.forEach((func) => {
                func();
            })
        }

        this._sockjs.onmessage = (e) => {
            this.receive(e.data);
        }

        this._sockjs.onclose = (e) => {
            this._state = CONNECT_STATE.CLOSED;
        }
    }

    onConnect(func) {
        this.onConnectFunctions.push(func);
    }

    receive(message) {
        const args = message.split("/");

        if (this.packets[args[0]])
            this.packets[args[0]](args);
        else
            console.error("PACKET", "Неизвестный пакет: " + args[0])
    }

    send(message) {
        if (!CONNECT_STATE.OPENED)
            return;

        this._sockjs.send(message);
    }

    getState() {
        return this._state;
    }

    registerPacket(id, func) {
        this.packets[id] = func;
    }
}

const CONNECT_STATE = {
    CLOSED: 0,
    AWAITING: 1,
    OPENED: 2
}