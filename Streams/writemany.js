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

// Dont do this
import fs from "node:fs/promises";
// it takes almost 400 ms to run
// CPU uses 30% of the cpu
// Memory Usage is about 150 MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");
  const stream = fileHandle.createWriteStream();

  for (let index = 0; index < 1000000; index++) {
    const buff = Buffer.from(`index ${index + 1} \n`, "utf-8");
    stream.write(buff);
  }
  fileHandle.close();
  console.timeEnd("writeMany");
})();
