import net from "node:net";
import fs from "node:fs/promises";

const PORT = 3000;
const HOSTNAME = "::1";
const server = net.createServer(() => {});

server.on("connection", (socket) => {
  let fileHandle, fileWriteStream;
  console.log("New connection!");

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // pause receiving data from the client

      const indexOfDivider = data.indexOf("-----");
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8");

      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream(); // the stream to write to

      // Writing to our destination file, discard the headers
      fileWriteStream.write(data.subarray(indexOfDivider + 5));

      socket.resume(); // resume receiving data from the client
      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
    }
  });

  // This end event happens when the client.js file ends the socket
  socket.on("end", () => {
    if (fileHandle) fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    console.log("Connection ended!");
  });
});

server.listen(PORT, HOSTNAME, () => {
  console.log("Uploader server started on ", server.address());
});
