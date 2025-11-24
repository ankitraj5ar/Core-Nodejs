import Butter from "../butter.js";

// A sample object in this array would look like:
// { userId: 1, token: 23423423 }
const SESSIONS = [];

const USERS = [
  { id: 1, name: "Liam Brown", username: "liam23", password: "string" },
  { id: 2, name: "Meredith Green", username: "merit.sky", password: "string" },
  { id: 3, name: "Ben Adams", username: "ben.poet", password: "string" },
];

const POSTS = [
  {
    id: 1,
    title: "This is a post title",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    userId: 1,
  },
];

const PORT = 3000;

const server = new Butter();

server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];
  if (routesToAuthenticate.indexOf(req.method + " " + req.url) != -1) {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];

      const session = SESSIONS.find((session) => session.token === token);
      if (session) {
        // Send the user's profile info
        req.userId = session.userId;
        return next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    }
  } else {
    next();
  }
});
server.beforeEach((req, res, next) => {
  if (req.headers["content-type"] == "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
    });

    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      return next();
    });
  } else {
    next();
  }
});

server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", ""];
  if (routes.indexOf(req.url) != -1 && req.method == "GET") {
    return res.status(200).sendFile("./public/index.html", "text/html");
  } else {
    next();
  }
});

// ------ Files Routes ------ //

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON Routes ------ //

// Log a user in and give them a token
server.route("post", "/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user exists
  const user = USERS.find((user) => user.username === username);

  // Check the password if the user was found
  if (user && user.password === password) {
    // At this point, we know that the client is who they say they are

    // Generate a random 10 digit token
    const token = Math.floor(Math.random() * 10000000000).toString();

    // Save the generated token
    SESSIONS.push({ userId: user.id, token: token });

    res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
    res.status(200).json({ message: "Logged in successfully!" });
  } else {
    res.status(401).json({ error: "Invalid username or password." });
  }
});

// Log a user out
server.route("delete", "/api/logout", (req, res) => {
  const sessionIndex = SESSIONS.findIndex(
    (session) => req.userId === session.userId
  );
  if (sessionIndex > -1) {
    SESSIONS.splice(sessionIndex, 1);
  }
  res.setHeader(
    "Set-Cookie",
    `token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
  res.status(200).json({ message: "Logged out successfully!" });
});

// Send user info
server.route("get", "/api/user", (req, res) => {
  // Send the user's profile info
  const user = USERS.find((user) => user.id === req.userId);
  res.json({ username: user.username, name: user.name });
});

// Update a user info
server.route("put", "/api/user", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const user = USERS.find((user) => user.id === req.userId);
  user.username = username;
  user.name = name;
  if (password) {
    user.password = password;
  }

  res.status(200).json({
    username: user.username,
    name: user.name,
    password_status: password ? true : false,
  });
});

// Send the list of all the posts that we have
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});

// Create a new post
server.route("post", "/api/posts", (req, res) => {
  const post = {
    id: POSTS.length + 1,
    body: req.body.body,
    title: req.body.title,
    userId: req.userId,
  };
  POSTS.unshift(post);
  res.status(201).json();
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
