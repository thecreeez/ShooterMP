// SERVER

function registerPackets(server) {
    server.getPacketManager().registerPacket("handshake", (conn, args) => {
        let name = args[1];

        let entityCandidate = server.getEntityManager().getEntity(name);

        if (entityCandidate) {
            conn.write("handshake/fail/player with that name already on a server.")
            return;
        }

        let newPlayer = server.getEntityManager().connectPlayer(name, conn);

        // ОТСЫЛКА ПЕРВЫХ ДАННЫХ (ИМЯ КАРТЫ И АВТОРА)
        let message = "handshake/success/";
        message += JSON.stringify(server.getWorldManager().getName()) + "/";
        message += JSON.stringify(server.getWorldManager().getAuthor());
        conn.write(message);

        // ОТСЫЛКА ТЕКСТУР
        for (let i = 1; i < server.getMapLoader().getTexturesLength(); i++) {
            message = "handshake/textures/"+i+"/"+JSON.stringify(server.getMapLoader().getTexture(i));
            conn.write(message);
        }

        // ОТСЫЛКА КООРДИНАТ И ДРУГИХ СУЩНОСТЕЙ
        message = "handshake/end/";
        message += JSON.stringify(server.getWorldManager().getTiles()) + "/"
        message += JSON.stringify(server.getEntityManager().getSerializedEntities({
            except: name
        })) + "/";
        message += JSON.stringify(newPlayer.pos);
        conn.write(message);

        server.getEntityManager().getPlayers().forEach((player) => {
            if (player.name != name)
                player.sendPacket("event/connect/" + JSON.stringify(newPlayer.serialize()));
        })
    })

    server.getPacketManager().registerPacket("event", (conn, args) => {

        switch (args[1]) {
            case "move": {
                let pos = JSON.parse(args[2]);

                if (pos[0] < 0)
                    return;

                if (pos[1] < 0)
                    return; 

                let sendedPlayer = server.getEntityManager().getPlayerByConnection(conn);
                sendedPlayer.setPos(pos);

                server.getEntityManager().getPlayers().forEach((player) => {
                    if (player.name != sendedPlayer.name)
                        player.sendPacket("event/move/" + JSON.stringify(pos) + "/" + sendedPlayer.name);
                })
                break;
            }
        }
    })

    server.getPacketManager().registerPacket("chat", (conn, args) => {
        let sendedPlayer = server.getEntityManager().getPlayerByConnection(conn);
        let messageTo = {
            sender: sendedPlayer.getName(),
            message: args[1]
        }

        server.getEntityManager().getPlayers().forEach((player) => {
            if (player.name != sendedPlayer.name)
                player.sendPacket("chat/" + JSON.stringify(messageTo));
        })
    })
}

export default registerPackets;