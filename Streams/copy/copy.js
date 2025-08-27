import { ReadStream } from "node:fs";
import fs from "node:fs/promises";

import { pipeline } from "node:stream/promises";

(async () => {
  console.time("copy");
  const srcFile = await fs.open("src.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  // basic method without stream
  //   let bytesRead = -1;
  //   while (bytesRead != 0) {
  //     const readResult = await srcFile.read();
  //     bytesRead = readResult.bytesRead;

  //     if (bytesRead != 16384) {
  //       const indexOfNotFilled = readResult.buffer.indexOf(0);
  //       const newBuffer = Buffer.alloc(indexOfNotFilled);
  //       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
  //     } else {
  //       destFile.write(readResult.buffer);
  //     }
  //     console.log(readResult);
  //   }

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  // with stream using pipe method
  //   readStream.pipe(writeStream);
  //   readStream.on("end", () => {
  //     console.timeEnd("copy");
  //   });

  // A more better way to copy a file using pipeline it provides better error handling than pipe
  try {
    await pipeline(readStream, writeStream);
  } catch (e) {
    console.log(e);
  }
})();
