import { error } from "node:console";
import dgram from "node:dgram";
const PORT = 3000;
const hostName = "127.0.0.1";

const sender = dgram.createSocket("udp4");

sender.send("This is string.", PORT, hostName, (error, bytes) => {
  if (error) {
    console.log("error", error);
  }
  console.log(bytes);
});
