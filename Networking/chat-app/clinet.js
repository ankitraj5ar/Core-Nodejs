import net from "node:net";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const port = 3000;
const host = "127.0.0.1";
const socket = net.createConnection({ port, host }, async () => {
  console.log("A client has been connected to server. \n");
  const message = await rl.question("Enter a message > ");
  socket.write(message);
});

socket.on("data", (data) => {
  console.log(data.toString("utf-8"));
});

// client.on("close", () => {
//   console.log("server is close");
// });
socket.on("end", () => {
  console.log("Connection was ended.");
});
