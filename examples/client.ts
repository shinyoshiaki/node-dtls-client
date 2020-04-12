import * as dtls from "../src/client";
const socket = dtls.Socket.createSocket({
  type: "udp4",
  address: "127.0.0.1",
  port: 4433,
  psk: { Client_identity: "X9LStOPeYT3UZu5w" },
})
  .on("connected", () => {
    socket.send(new Buffer("### node->openssl\n"));
  })
  .on("message", (msg) => {
    socket.send(new Buffer("echo : " + msg.toString()));
  });
