// CLIENT

GameInstance.getPacketManager().registerPacket("handshake", (args) => {
    switch (args[1]) {
        case "fail": {
            GameInstance.getLoggerRenderer().log("PacketManager", "Cant connected to server: "+args[2], LOG_TYPE.ERROR)
            break;
        }

        case "success": {
            //)
            GameInstance.getLoggerRenderer().log("PacketManager", "Connected! Map: "+args[2]+" by "+args[3], LOG_TYPE.FINE)
            break;
        }

        case "textures": {
            let id = args[2];
            let data = JSON.parse(args[3]);

            GameInstance.getTextureManager().setTexture(id, data);
            GameInstance.getLoggerRenderer().log("PacketManager", "Loaded texture "+id+" ["+data.length+"x"+data[0].length+"]", LOG_TYPE.DEFAULT)
            break;
        }

        case "end": {
            GameInstance.setState(PlayState.fromServer(GameInstance, args))
            break;
        }

        default: {
            console.log(args);
        }
    }
})

GameInstance.getPacketManager().registerPacket("event", (args) => {
    switch (args[1]) {
        case "connect": {
            GameInstance.getState().addEntity(JSON.parse(args[2]))
            GameInstance.getLoggerRenderer().log("PacketManager", "User " + JSON.parse(args[2]).name + " connected.", LOG_TYPE.DEFAULT)
            break;
        }

        case "disconnect": {
            GameInstance.getState().removeEntity(JSON.parse(args[2]));
            GameInstance.getLoggerRenderer().log("PacketManager", "User " + JSON.parse(args[2]).name + " disconnected.", LOG_TYPE.DEFAULT)
            break;
        }

        case "move": {
            let pos = JSON.parse(args[2]);
            let name = args[3];

            let entity = GameInstance.getState().getEntity(name);

            if (entity)
                entity.teleport(pos);

            break;
        }
    }
})

GameInstance.getPacketManager().registerPacket("chat", (args) => {
    GameInstance.getLoggerRenderer().log("Chat", "[" + JSON.parse(args[1]).sender + "]: "+JSON.parse(args[1]).message, LOG_TYPE.DEFAULT)
})