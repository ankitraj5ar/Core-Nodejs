import http from "node:http";
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
  req.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
});

server.listen(port, hostname, () => {
  console.log("server started on ", server.address());
});
