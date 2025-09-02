import { Writable } from "node:stream";
import fs from "node:fs";
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
    fs.open(this.fileName, "w", (err, fileDescriptor) => {
      if (err) {
        // so if we call the callback with an argument , it means that we have an error
        // and we should not be proceed
        return callback(err);
      } else {
        this.fd = fileDescriptor;
        // no argument means it was successful
        callback();
      }
    });
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
      this.chunks = [];
      this.chunksSize = 0;
      ++this.writeCounts;
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

// const stream = new FileWriteStream({
//   highWaterMark: 1800,
//   fileName: "text.txt",
// });
// // console.log(stream);
// stream.write(Buffer.from("This is from stream. "));
// stream.end(Buffer.from("This is our last write"));
// stream.on("finish", () => {
//   console.log("finished");
// });
// stream.on("drain", () => {
//   console.log("drain");
// });

(async () => {
  console.time("writeMany");
  const stream = new FileWriteStream({
    fileName: "text.txt",
  });

  let i = 0;
  const noOfWrite = 50000;
  const writeMany = () => {
    while (i < noOfWrite) {
      const buff = Buffer.from(` ${i + 1} \n`, "utf-8");
      //this is is our last write close the stream
      if (i === noOfWrite - 1) {
        stream.end(buff);
        return;
      }
      // if stream.write return false stop the loop
      if (!stream.write(buff)) {
        break;
      }
      i++;
    }
  };

  writeMany();

  // resume our stream if internal buffer is full
  stream.on("drain", () => {
    console.log("Draining !!!!");
    writeMany();
  });
  stream.on("finish", () => {
    console.timeEnd("writeMany");
  });
})();
