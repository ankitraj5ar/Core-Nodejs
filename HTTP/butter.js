import http from "node:http";
import fs from "node:fs/promises";
export default class Butter {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.middleWare = [];
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

      const runMiddleWare = (req, res, middleWare, index) => {
        if (index == this.middleWare.length) {
          // if the routes object does not have a key of req.method + req.url return 4o4
          if (!this.routes[req.method.toLowerCase() + req.url]) {
            return res
              .status(404)
              .json({ error: `Cannot ${req.method} ${req.url}` });
          }

          this.routes[req.method.toLowerCase() + req.url](req, res);
        } else {
          middleWare[index](req, res, () => {
            runMiddleWare(req, res, middleWare, index + 1);
          });
        }
      };

      runMiddleWare(req, res, this.middleWare, 0);
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }

  beforeEach(cb) {
    this.middleWare.push(cb);
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }
}
