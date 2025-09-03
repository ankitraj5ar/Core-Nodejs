import net from "node:net";

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  const buff = Buffer.alloc(2);
  buff[0] = 10;
  buff[1] = 22;
  socket.write(buff);
});
