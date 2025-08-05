import { Buffer, constants } from "buffer";

const buff = Buffer.alloc(1e9);
console.log(constants.MAX_LENGTH);
setInterval(() => {
  // for (let i = 0; i < buff.length; i++) {
  //   buff[i] = 0x22;
  // }
  buff.fill(0x22);
}, 5000);

// console.log(buff.toString("utf-8"));
