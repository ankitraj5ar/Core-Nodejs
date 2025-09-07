import net from "node:net";
const port = 3000;
const hostName = "172.31.35.72";

const server = net.createServer();
// an array of client sockets
const clients = [];
server.on("connection", (socket) => {
  const intClientId = clients.length + 1;
  socket.write(`id-${intClientId}`);

  // notifying everyone when someone join the room
  clients.map((client) => {
    client.socket.write(`User ${intClientId}: joined!.`);
  });

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // notifying everyone when someone leave the room.
  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`> User ${intClientId} left!.`);
    });
  });

  clients.push({ id: intClientId.toString(), socket });
});

server.listen(port, hostName, () => {
  console.log("server listening on ", server.address());
});
