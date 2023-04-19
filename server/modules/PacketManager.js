import sockjs from "sockjs";
import http from "http";

class PacketManager {
    constructor(server, logger) {
        this._server = server;
        this._logger = logger;
        this._socket = sockjs.createServer({ prefix: "/socket", disable_cors: false});

        this._socket.on('connection', (conn) => {
            conn.on('data', (data) => {
                this._server.getPacketManager().receive(conn, data);
            })

            conn.on('close', () => {
                console.log("closed")
                this._server.getEntityManager().disconnect(conn.id);
            })
        })

        this._httpServer = http.createServer();
        this._socket.installHandlers(this._httpServer);

        this.connections = new Map();

        this.packets = {};
    }

    start(port) {
        this._httpServer.listen(port);
        this._logger.log("Сервер запущен на порте " + port)
    }

    receive(conn, data) {
        const args = data.split("/");

        if (this.packets[args[0]])
            this.packets[args[0]](conn, args);
        else
            this._logger.error("Неизвестный пакет: " + args[0])
    }

    sendPacket(conn, data) {
        conn.write(data);
    }

    registerPacket(id, func) {
        this.packets[id] = func;
    }
}

export default PacketManager;