import { stdin, stdout, stderr, argv, exit } from "node:process";
import fs from "node:fs";

// getting the first argument and output the file content to stdout
const filePath = argv[2];

if (filePath) {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(stdout);
  fileStream.on("end", () => {
    stdout.write("\n");
    exit(0);
  });
}

stdin.pipe(stdout);

// stdin.on("data", (data) => {
//   console.log(data.toString("utf-8"));
// });
