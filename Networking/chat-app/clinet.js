import net from "node:net";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const port = 3000;
const host = "127.0.0.1";

const clearLine = (dir) => {
  return new Promise((resolve, rejects) => {
    output.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    output.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const socket = net.createConnection({ port, host }, async () => {
  console.log("Connected to server. \n");

  const ask = async () => {
    const message = await rl.question("Enter a message > ");
    // move the cursor one line up
    await moveCursor(0, -1);
    // clear the current line at current cursor position
    await clearLine(0);
    socket.write(message);
  };
  ask();
  socket.on("data", async (data) => {
    console.log();
    // move the cursor one line up
    await moveCursor(0, -1);
    // clear the current line at current cursor position
    await clearLine(0);
    console.log(data.toString("utf-8"));
    ask();
  });
});

// client.on("close", () => {
//   console.log("server is close");
// });
socket.on("end", () => {
  console.log("Connection was ended.");
});
