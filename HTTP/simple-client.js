import http from "node:http";
import { title } from "node:process";

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent: agent,
  hostname: "localhost",
  port: 3000,
  method: "POST",
  path: "/create-post",
  headers: {
    "content-type": "application/json",
    "content-length": 61,
    name: "ankit raj",
  },
});

request.on("response", (res) => {
  console.log("STATUs");
  console.log(res.statusCode);
  console.log("headers");
  console.log(res.headers);
  console.log("body");
  res.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
});
const data = Buffer.from(
  JSON.stringify({
    message: "hi there",
    title: "a message",
    user: "ankit raj",
  }),
  "utf-8"
);
console.log("length", data.length);
request.write(
  JSON.stringify({ message: "hi there", title: "a message", user: "ankit raj" })
);
request.end();
