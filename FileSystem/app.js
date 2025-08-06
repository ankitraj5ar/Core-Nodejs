import fs from "node:fs";

const content = fs.readFileSync("./text.txt");
console.log(content.toString("utf-8"));
