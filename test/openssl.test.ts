import { spawn } from "child_process";
import * as dtls from "../src/client";
import { expect } from "chai";

describe("openssl", () => {
  it("openssl_server", (done) => {
    const server = spawn("openssl", [
      "s_server",
      "-psk",
      "58394c53744f5065595433555a753577",
      "-dtls1_2",
      "-accept",
      "127.0.0.1:5685",
      "-debug",
      "-msg",
      "-state",
      "-cipher",
      "PSK-AES128-CCM8",
      "-nocert",
      "-no_ticket",
    ]);
    server.stdout.setEncoding("ascii");
    server.stdout.on("data", (data: string) => {
      if (data.includes("### node->openssl")) {
        server.stdin.write("### openssl->node\n");
      }
    });
    setTimeout(() => {
      const socket = dtls.Socket.createSocket({
        type: "udp4",
        address: "127.0.0.1",
        port: 5685,
        psk: { Client_identity: "X9LStOPeYT3UZu5w" },
      })
        .on("connected", () => {
          socket.send(new Buffer("### node->openssl\n"));
        })
        .on("message", (msg) => {
          expect(msg).deep.equal(new Buffer("### openssl->node\n"));
          server.kill();
          socket.close();
          done();
        });
    }, 100);
  });
});
