import { Readable } from "node:stream";
import fs from "node:fs";

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) {
        return callback(err);
      }
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        return this.destroy(err);
      }
      // null is used to tell the steam that file has been read so end it
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        return callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileReadStream({ fileName: "text.txt" });
stream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
stream.on("end", (chunk) => {
  console.log("Stream is done reading.");
});
