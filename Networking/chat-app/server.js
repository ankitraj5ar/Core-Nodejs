import net from "node:net";
const port = 3000;
const hostName = "127.0.0.1";

const server = net.createServer();
// an array of client sockets
const client = [];
server.on("connection", (socket) => {
  console.log("A new client has been connected.");
  socket.on("data", (data) => {
    client.map((s) => {
      s.write(data);
    });
  });

  client.push(socket);
});

server.listen(port, hostName, () => {
  console.log("server listening on ", server.address());
});
