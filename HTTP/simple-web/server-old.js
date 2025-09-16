import http from "node:http";
import fs from "node:fs/promises";

const PORT = 3000;
const hostname = "127.0.0.1";
const server = http.createServer();

server.on("request", async (req, res) => {
  //   console.log(req.url, req.method);
  if (req.url === "/") {
    res.setHeader("content-type", "text/html");
    const fileHandle = await fs.open("./public/index.html", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileStream.on("close", () => {
      fileHandle.close();
      res.end();
    });
  }
  if (req.url === "/style.css") {
    res.setHeader("content-type", "text/css");
    const fileHandle = await fs.open("./public/style.css", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileStream.on("close", () => {
      fileHandle.close();
      res.end();
    });
  }
  if (req.url === "/script.js") {
    res.setHeader("content-type", "text/javascript");
    const fileHandle = await fs.open("./public/script.js", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(res);
    fileStream.on("close", () => {
      fileHandle.close();
      res.end();
    });
  }
  if (req.url === "/login" && req.method === "POST") {
    res.setHeader("content-type", "application/json");
    res.statusCode = 200;
    const body = { message: "This is json file" };

    res.end(JSON.stringify(body));
  }
  if (req.url === "/user" && req.method === "PUT") {
    res.setHeader("content-type", "application/json");
    res.statusCode = 200;
    const body = { name: "Ankit Raj" };

    res.end(JSON.stringify(body));
  }
  if (req.url === "/upload" && req.method === "POST") {
    const fileHandle = await fs.open("./storage/image.jpeg", "w");
    const fileStream = fileHandle.createWriteStream();
    req.pipe(fileStream);
    req.on("end", () => {
      fileHandle.close();
      res.setHeader("content-type", "application/json");
      res.statusCode = 200;

      res.end(
        JSON.stringify({ message: "file has been uploaded successfully." })
      );
    });
  }
});

server.listen(PORT, hostname, () => {
  console.log(`server started on `, server.address());
});
