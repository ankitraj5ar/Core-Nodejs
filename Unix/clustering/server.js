const cpeak = require("cpeak");
const server = new cpeak();

server.route("get", "/", (req, res) => {
  res.json({ message: "this is some test" });
});

server.route("get", "/heavy", async (req, res) => {
  let element = 0;
  for (let index = 0; index < 10000000000; index++) {
    element += index;
  }
  res.json({ message: "The operation is done", count: element });
});

const PORT = 5090;

server.listen(PORT, () => {
  console.log("server has started on port", PORT);
});
