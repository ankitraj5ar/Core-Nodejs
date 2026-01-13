import { spawn } from "node:child_process";
import fs from "node:fs";

// for node js application
const subProcess = spawn("node", ["numberFormatter.js", "./des.txt", "$", ","]);
// for c application
// const subProcess = spawn("./numberFormatter", ["./des.txt", "$", ","]);
subProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

subProcess.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

subProcess.on("close", (code) => {
  if (code === 0) {
    console.log("The file was read, processed and written successfully.");
  } else {
    console.log("Something went wrong.");
  }
});

const fileStream = fs.createReadStream("./src.txt");
fileStream.pipe(subProcess.stdin);
