function registerPackets(server) {
    server.getPacketManager().registerPacket("handshake", (conn, args) => {
        
        console.log(args);
    })
}

export default registerPackets;