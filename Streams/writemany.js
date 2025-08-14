// import fs from "node:fs/promises";
// it takes almost 14 sec to run
// CPU uses 30% of the cpu
// Memory Usage is about 3.5 GB
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");
//   for (let index = 0; index < 1000000; index++) {
//     fileHandle.write(`index ${index + 1} \n`);
//   }
//   fileHandle.close();
//   console.timeEnd("writeMany");
// })();

// import fs from "node:fs";
// // it takes almost 2 sec to run
// // CPU uses 30% of the cpu
// // Memory Usage is about 50 MB
// (async () => {
//   console.time("writeMany");
//   fs.open("test.txt", "w", (err, fd) => {
//     for (let index = 0; index < 1000000; index++) {
//       const buff = Buffer.from(`index ${index + 1} \n`, "utf-8");
//       fs.writeSync(fd, buff);
//     }
//     console.timeEnd("writeMany");
//   });
// })();

// // Don't do this
// import fs from "node:fs/promises";
// // it takes almost 400 ms to run
// // CPU uses 30% of the cpu
// // Memory Usage is about 150 MB
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");
//   const stream = fileHandle.createWriteStream();

//   for (let index = 0; index < 1000000; index++) {
//     const buff = Buffer.from(`index ${index + 1} \n`, "utf-8");
//     stream.write(buff);
//   }
//   fileHandle.close();
//   console.timeEnd("writeMany");
// })();

// Stream memory issue fixed
import fs from "node:fs/promises";
// it takes almost 400 ms to run
// CPU uses 30% of the cpu
// Memory Usage is about 150 MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");
  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);
  // console.log(stream.writableLength);
  const buff = Buffer.alloc(65535, 12);
  console.log(stream.write(buff));
  console.log(stream.write(Buffer.alloc(1, "a")));

  stream.on("drain", () => {
    console.log(stream.write(Buffer.alloc(65535, 12)));
    console.log(stream.write(Buffer.alloc(1, "a")));
    console.log("we are now safe to write.");
  });
  // console.log(stream.writableLength);

  // for (let index = 0; index < 1000000; index++) {
  //   const buff = Buffer.from(`index ${index + 1} \n`, "utf-8");
  //   stream.write(buff);
  // }

  // fileHandle.close();
  console.timeEnd("writeMany");
})();
