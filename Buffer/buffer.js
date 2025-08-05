import { Buffer } from "node:buffer";

const memoryContainer = Buffer.alloc(4); // 4bytes (32 bits)

memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x34;
// memoryContainer[2] = -34; // this is not the right way to store negative number
memoryContainer.writeInt8(-34, 2); // this is the right way to store negative number
memoryContainer[3] = 0xff;
console.log(memoryContainer);
console.log(memoryContainer[0]);
console.log(memoryContainer[1]);
console.log(memoryContainer.readInt8(2));
console.log(memoryContainer[3]);

console.log(memoryContainer.toString("hex"));
