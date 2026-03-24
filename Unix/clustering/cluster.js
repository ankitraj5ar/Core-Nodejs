const cluster = require("node:cluster");
const os = require("node:os");
const coreCount = os.availableParallelism();
if (cluster.isPrimary) {
  console.log("The parent process PID " + process.pid);
  for (let i = 0; i < coreCount; i++) {
    const worker = cluster.fork();
    console.log(
      `The parent process spawned a new child process with PID ${worker.process.pid}`,
    );
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} ${signal || code} died. Restarting...`,
    );
    cluster.fork();
    console.log(
      `The parent process spawned a new child process with PID ${worker.process.pid}`,
    );
  });
} else {
  console.log("This is child process");
  require("./server.js");
}
