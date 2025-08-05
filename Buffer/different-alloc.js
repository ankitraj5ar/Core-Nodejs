import { Buffer } from "buffer";

const buffer = Buffer.alloc(10000);
const unSafeBuffer = Buffer.allocUnsafe(10000);

for (let i = 0; i < buffer.length; i++) {
  if (buffer[i] != 0) {
    console.log(
      "Element at poistion " + i + " has value => " + buffer[i].toString(2)
    );
  }
}
