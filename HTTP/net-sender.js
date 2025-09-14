import net from "node:net";

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  const head = Buffer.from(
    "504f5354202f6372656174652d706f737420485454502f312e310d0a636f6e74656e742d747970653a206170706c69636174696f6e2f6a736f6e0d0a636f6e74656e742d6c656e6774683a2036310d0a6e616d653a20616e6b69742072616a0d0a486f73743a206c6f63616c686f73743a333030300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a0d0a",
    "hex"
  );
  const body = Buffer.from(
    "7b226d657373616765223a226869207468657265222c227469746c65223a2261206d657373616765222c2275736572223a22616e6b69742072616a227d",
    "hex"
  );
  //   console.log("head", head.toString("utf-8"));
  //   console.log("body", body.toString("utf-8"));
  //   console.log("final data", Buffer.concat([head, body]));
  socket.write(Buffer.concat([head, body]));
});

socket.on("data", (chunk) => {
  console.log("Received Response");
  console.log(chunk.toString("utf-8"));
  console.log(chunk.toString("hex"));
  socket.end();
});

socket.on("end", () => {
  console.log("collection close");
});

// ----------------------------------

// 0000   50 4f 53 54 20 2f 63 72 65 61 74 65 2d 70 6f 73   POST /create-pos
// 0010   74 20 48 54 54 50 2f 31 2e 31 0d 0a 63 6f 6e 74   t HTTP/1.1..cont
// 0020   65 6e 74 2d 74 79 70 65 3a 20 61 70 70 6c 69 63   ent-type: applic
// 0030   61 74 69 6f 6e 2f 6a 73 6f 6e 0d 0a 6e 61 6d 65   ation/json..name
// 0040   3a 20 61 6e 6b 69 74 20 72 61 6a 0d 0a 48 6f 73   : ankit raj..Hos
// 0050   74 3a 20 6c 6f 63 61 6c 68 6f 73 74 3a 33 30 30   t: localhost:300
// 0060   30 0d 0a 43 6f 6e 6e 65 63 74 69 6f 6e 3a 20 6b   0..Connection: k
// 0070   65 65 70 2d 61 6c 69 76 65 0d 0a 54 72 61 6e 73   eep-alive..Trans
// 0080   66 65 72 2d 45 6e 63 6f 64 69 6e 67 3a 20 63 68   fer-Encoding: ch
// 0090   75 6e 6b 65 64 0d 0a 0d 0a                        unked....

// 0000   7b 22 6d 65 73 73 61 67 65 22 3a 22 68 69 20 74   {"message":"hi t
// 0010   68 65 72 65 22 2c 22 74 69 74 6c 65 22 3a 22 61   here","title":"a
// 0020   20 6d 65 73 73 61 67 65 22 2c 22 75 73 65 72 22    message","user"
// 0030   3a 22 61 6e 6b 69 74 20 72 61 6a 22 7d            :"ankit raj"}

// 0000   50 4f 53 54 20 2f 63 72 65 61 74 65 2d 70 6f 73
// 0010   74 20 48 54 54 50 2f 31 2e 31 0d 0a 63 6f 6e 74
// 0020   65 6e 74 2d 74 79 70 65 3a 20 61 70 70 6c 69 63
// 0030   61 74 69 6f 6e 2f 6a 73 6f 6e 0d 0a 6e 61 6d 65
// 0040   3a 20 61 6e 6b 69 74 20 72 61 6a 0d 0a 48 6f 73
// 0050   74 3a 20 6c 6f 63 61 6c 68 6f 73 74 3a 33 30 30
// 0060   30 0d 0a 43 6f 6e 6e 65 63 74 69 6f 6e 3a 20 6b
// 0070   65 65 70 2d 61 6c 69 76 65 0d 0a 54 72 61 6e 73
// 0080   66 65 72 2d 45 6e 63 6f 64 69 6e 67 3a 20 63 68
// 0090   75 6e 6b 65 64 0d 0a 0d 0a

// 504f5354202f6372656174652d706f737420485454502f312e310d0a636f6e74656e742d747970653a206170706c69636174696f6e2f6a736f6e0d0a6e616d653a20616e6b69742072616a0d0a486f73743a206c6f63616c686f73743a333030300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a

// 7b226d657373616765223a226869206275646479207468697320697320796f757220726573706f6e73652066726f6d20736572766572227d
