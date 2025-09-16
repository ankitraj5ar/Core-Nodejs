import http from "node:http";
import fs from "node:fs/promises";
export default class Butter {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.server.on("request", (req, res) => {
      // a function sendFile attached to res object to send file to user
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);
        fileStream.on("end", () => {
          fileHandle.close();
          res.end();
        });
      };

      // a method to add status code
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      // a method to return json
      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      // if the routes object does not have a key of req.method + req.url return 4o4
      if (!this.routes[req.method.toLowerCase() + req.url]) {
        return res
          .status(404)
          .json({ error: `Cannot ${req.method} ${req.url}` });
      }
      this.routes[req.method.toLowerCase() + req.url](req, res);
    });
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }
}
