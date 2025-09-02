import { Duplex } from "node:stream";
import fs, { readFile, writeFile } from "node:fs";

class DuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFile,
    writeFile,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark });
    this.readFile = readFile;
    this.writeFile = writeFile;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFile, "r", (err, readFd) => {
      if (err) {
        return callback(err);
      }
      this.readFd = readFd;
      fs.open(this.writeFile, "w", (err, writeFd) => {
        if (err) {
          return callback(err);
        }
        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        return this.destroy(err);
      }
      // null is used to tell the steam that file has been read so end it
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }
      this.chunks = [];
      this.chunksSize = 0;
      callback();
    });
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const duplex = new DuplexStream({
  readFile: "read.txt",
  writeFile: "write.txt",
});

duplex.write("this is first line \n");
duplex.write("this is second line \n");
duplex.write("this is third line \n");
duplex.write("this is fourth line \n");
duplex.write("this is fifth line \n");
duplex.write("this is sixth line \n");
duplex.write("this is seventh line \n");
duplex.end("duplex stream end on eight line \n");

duplex.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
