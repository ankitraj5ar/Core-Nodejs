import { Writable } from "node:stream";
import fs from "node:fs";
import { callbackify } from "node:util";
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writeCounts = 0;
  }

  // this will run after the constructor and it will put off calling all the other methods until we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // so if we call the callback with an argument , it means that we have an error
        // and we should not be proceed
        return callback(err);
      } else {
        this.fd = fd;
      }
    });
    // no argument means it was successful
    callback();
  }

  _write(chunk, encoding, callback) {
    // do our write operation
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writeCounts;
        callback();
      });
    } else {
      // when we're done, we should call the callback function
      callback();
    }
  }
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }
      ++this.writeCounts;
      this.chunks = [];
      callback();
    });
  }
  _destroy(error, callback) {
    console.log("number of writes: ", this.writeCounts);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});

stream.write(Buffer.from("this is from stream"));
stream.end(Buffer.from("this is our last write"));
stream.on("drain", () => {
  console.log();
});
