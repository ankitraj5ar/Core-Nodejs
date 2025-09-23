import Butter from "../butter.js";
const PORT = 9001;
const USERS = [
  {
    id: 1,
    name: "Ankit Raj",
    username: "ankitraj5ar",
    password: "Admin@123",
  },
  {
    id: 2,
    name: "Aniket Roy",
    username: "anki",
    password: "Admin@123",
  },
  {
    id: 13,
    name: "no name",
    username: "nam",
    password: "Admin@123",
  },
];
const POSTS = [
  {
    id: 1,
    title: "This is post title",
    body: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap i",
    userId: 1,
  },
];

const server = new Butter();

// files route
server.route("get", "/", (req, res) => {
  console.log("server 1 is handling the request.");
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});
server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.username;
    return post;
  });
  res.status(200).json(posts);
});
server.route("get", "/api/user", (req, res) => {
  res.status(200).json(USERS);
});
server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
  });
  req.on("end", () => {
    body = JSON.parse(body);
    const username = body.username;
    const password = body.password;

    // check if user exist
    const user = USERS.find((user) => user.username === username);
    if (user && user.password === password) {
      res.status(200).json({ message: "logged in successfully." });
    } else {
      res.status(400).json({ message: "Invalid username or password." });
    }
  });
});
server.route("post", "/api/user", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
  });
  req.on("end", () => {
    body = JSON.parse(body);
    const username = body.username;
    const password = body.password;

    // check if user exist
    const user = USERS.find((user) => user.username === username);
    if (user && user.password === password) {
      res.status(200).json({ message: "logged in successfully." });
    } else {
      res.status(400).json({ message: "Invalid username or password." });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
