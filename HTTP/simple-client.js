import http from "node:http";

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent: agent,
  hostname: "localhost",
  port: 3000,
  method: "POST",
  path: "/create-post",
  headers: {
    "content-type": "application/json",
    "content-length": 40,
  },
});

request.on("response", (response) => {});

request.write(JSON.stringify({ message: "hi there" }));
request.write(JSON.stringify({ message: "how are you doing" }));
request.write(JSON.stringify({ message: "hey you still there" }));
request.end(JSON.stringify("our last message"));
