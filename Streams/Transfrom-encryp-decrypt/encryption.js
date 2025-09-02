import { Transform } from "node:stream";
import fs from "node:fs/promises";

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    // adding 1 to each buffer
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] != 255) {
        chunk[i] += 1;
      }
    }

    // both method will work but callback is better and good
    // this.push(chunk);
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("read.txt", "r");
  const writeFileHandle = await fs.open("write.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();
  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
})();
