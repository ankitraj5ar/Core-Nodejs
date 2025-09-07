import net from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";

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

const PORT = 3000;
const HOSTNAME = "::1";

const socket = net.createConnection(
  { host: HOSTNAME, port: PORT },
  async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, "r");
    const fileReadStream = fileHandle.createReadStream(); // the stream to read from
    const totalReadFileSize = (await fileHandle.stat()).size;
    let uploadedPercentage = 0;
    let bytesUploaded = 0;

    socket.write(`fileName: ${fileName}-----`);
    console.log();
    // Reading from the source file
    fileReadStream.on("data", async (data) => {
      if (!socket.write(data)) {
        fileReadStream.pause();
      }
      bytesUploaded += data.length;
      let newPercentage = Math.floor((bytesUploaded / totalReadFileSize) * 100);
      if (newPercentage % 5 === 0 && newPercentage != uploadedPercentage) {
        uploadedPercentage = newPercentage;
        await moveCursor(0, -1);
        await clearLine();
        console.log(`file Uploaded ${uploadedPercentage} %`);
      }
    });

    socket.on("drain", () => {
      fileReadStream.resume();
    });

    fileReadStream.on("end", () => {
      console.log("The file was successfully uploaded!");
      socket.end();
    });
  }
);
