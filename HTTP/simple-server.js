import http from "node:http";
import { json } from "node:stream/consumers";
const port = 3000;
const hostname = "127.0.0.1";
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("---------- METHOD ------------");
  console.log(req.method);
  console.log("---------- URL ------------");
  console.log(req.url);
  console.log("---------- HEADERS ------------");
  console.log(req.headers);
  console.log("---------- BODY ------------");

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    data = JSON.parse(data);
    console.log(data);
    res.setHeader("custom-header", "raj ankit");
    res.writeHead(200, "ok", { "content-type": "application/json" });
    res.end(
      JSON.stringify({ message: "hi buddy this is your response from server" })
    );
  });
});

server.listen(port, hostname, () => {
  console.log("server started on ", server.address());
});
