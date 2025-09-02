import { Transform } from "node:stream";
import fs from "node:fs/promises";

class Decrypt extends Transform {
  #totalBytesRead = 0;
  #totalFileSize = 0; // private field

  constructor(totalFileSize) {
    super();
    this.#totalFileSize = totalFileSize;
  }
  // subtracting 1 to each buffer
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      chunk[i] -= 1;
    }
    this.#totalBytesRead += chunk.length;
    // both method will work but callback is better and good
    // this.push(chunk);
    if (this.#totalBytesRead % 18 == 0) {
      console.log(
        "Decrypting ",
        Math.floor((this.#totalBytesRead / this.#totalFileSize) * 100),
        "%"
      );
    }
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("write.txt", "r");
  const writeFileHandle = await fs.open("decrypt.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();
  // get file stats (metadata)
  const totalReadFileSize = (await readFileHandle.stat()).size;
  const decrypt = new Decrypt(totalReadFileSize);

  readStream.pipe(decrypt).pipe(writeStream);
})();
