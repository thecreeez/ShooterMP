// CLIENT

GameInstance.getPacketManager().registerPacket("handshake", (args) => {
    switch (args[1]) {
        case "fail": {
            GameInstance.getLoggerRenderer().log("PacketManager", "Cant connected to server: "+args[2], LOG_TYPE.ERROR)
            break;
        }

        case "success": {
            console.log("connected! ",JSON.parse(args[3]))
            GameInstance.load({
                map: JSON.parse(args[2]),
                entities: JSON.parse(args[3]),
                pos: JSON.parse(args[4])
            });

            GameInstance.getLoggerRenderer().log("PacketManager", "Server successfully connected!", LOG_TYPE.FINE)
            break;
        }
    }
})

GameInstance.getPacketManager().registerPacket("event", (args) => {
    switch (args[1]) {
        case "connect": {
            GameInstance.join(JSON.parse(args[2]));

            GameInstance.getLoggerRenderer().log("PacketManager", "User " + JSON.parse(args[2]).name + " connected.", LOG_TYPE.DEFAULT)
            break;
        }

        case "disconnect": {
            GameInstance.disconnect(JSON.parse(args[2]));

            GameInstance.getLoggerRenderer().log("PacketManager", "User " + JSON.parse(args[2]).name + " disconnected.", LOG_TYPE.DEFAULT)
            break;
        }

        case "move": {
            let pos = JSON.parse(args[2]);
            let name = args[3];

            let entity = GameInstance.getEntity(name);

            if (entity)
                entity.teleport(pos)
        }
    }
})

GameInstance.getPacketManager().registerPacket("chat", (args) => {
    GameInstance.getLoggerRenderer().log("Chat", "[" + JSON.parse(args[1]).sender + "]: "+JSON.parse(args[1]).message, LOG_TYPE.DEFAULT)
})