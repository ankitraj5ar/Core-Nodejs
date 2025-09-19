import Butter from "../butter.js";

const PORT = 3000;
const server = new Butter();

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/style.css", (req, res) => {
  res.sendFile("./public/style.css", "text/css");
});
server.route("get", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});
server.route("post", "/login", (req, res) => {
  res.status(400).json({ error: "bro what are you doing !!!" });
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
