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

        let message = "handshake/success/";
        message += JSON.stringify(server.getWorldManager().getMap()) + "/";
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
}

export default registerPackets;