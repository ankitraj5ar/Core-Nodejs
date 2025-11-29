import { spawn, exec } from "node:child_process";

// const subprocess = spawn("echo 'something string' | tr ' ' '\n'");

// subprocess.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

exec("echo 'something string' | tr ' ' '\n'", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(stdout);
  console.log("stderr", stderr);
});
