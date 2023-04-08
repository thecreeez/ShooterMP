GameInstance.getPacketManager().registerPacket("handshake", (args) => {
    switch (args[1]) {
        case "approve": {
            GameInstance.getPacketManager().send("join/map");
            break;
        }

        case "reject": {
            console.log("Не удалось подключиться: " + args[2]);
            break;
        }
    }
})