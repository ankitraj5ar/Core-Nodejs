import dgram from "node:dgram";
const PORT = 3000;
const hostName = "127.0.0.1";
const receiver = dgram.createSocket("udp4");
receiver.on("message", (message, remoteInfo) => {
  console.log(message.toString("utf-8"), remoteInfo);
});

receiver.bind({ port: PORT, address: hostName });

receiver.on("listening", () => {
  console.log(`Server listening on`, receiver.address());
});
