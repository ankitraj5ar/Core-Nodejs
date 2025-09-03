import net from "node:net";

const server = net.createServer((socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk);
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log("opened server on ", server.address());
});
