import Server from "./Server.js";
import registerPackets from "./modules/packets.js";

const ServerInstance = new Server();

registerPackets(ServerInstance);
ServerInstance.start(2020);