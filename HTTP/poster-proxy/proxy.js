import http from "node:http";

// proxy port
const PORT = 9000;

const mainServers = [
  { host: "localhost", port: 9001 },
  { host: "localhost", port: 9002 },
];

const proxy = http.createServer();

proxy.on("request", (ClientRequest, ProxyResponse) => {
  // select a server to route the incoming request to (using round-robin-algorithm)
  const mainServer = mainServers.shift();
  mainServers.push(mainServer);

  console.log("mainServer=>", mainServer);
  console.log("mainServers=>", mainServers);

  const proxyRequest = http.request({
    host: mainServer.host,
    port: mainServer.port,
    path: ClientRequest.url,
    method: ClientRequest.method,
    headers: ClientRequest.headers,
  });

  proxyRequest.on("response", (mainServerResponse) => {
    // set the status code and header for the response that we are sending to the client
    ProxyResponse.writeHead(
      mainServerResponse.statusCode,
      mainServerResponse.headers
    );

    // finally write the body of the main server's response to the body of proxy response
    // and send the response to the client.

    mainServerResponse.pipe(ProxyResponse);
  });
  // write the body of the client's request to the body of proxy's request being made
  // to one of our server
  ClientRequest.pipe(proxyRequest);
});

proxy.listen(PORT, "127.0.0.1", () => {
  console.log("server started on", proxy.address());
});
