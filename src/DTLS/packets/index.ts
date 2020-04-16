import * as Handshake from "../Handshake";
import { ProtocolVersion } from "../../TLS/ProtocolVersion";
import { ServerHello } from "./server/hello";
import { decode } from "binary-data";
import { Certificate } from "./certificate";
import { HelloRequest } from "./helloRequest";
import { ClientHello } from "./client/hello";

const handlers: {
  [key in keyof typeof Handshake.HandshakeType]: any;
} = {} as any;
handlers[Handshake.HandshakeType.server_hello] = ServerHello;
handlers[Handshake.HandshakeType.certificate] = Certificate;
handlers[Handshake.HandshakeType.hello_request] = HelloRequest;
handlers[Handshake.HandshakeType.client_hello] = ClientHello;

export function parseMessage(msg: Handshake.FragmentedHandshake) {
  const Handler = handlers[msg.msg_type];
  if (!Handler) {
    const handshake = Handshake.Handshake.fromFragment(msg);
    return handshake;
  }
  const fragment = decode(msg.fragment, Handler.spec);
  const handshake = new Handler(...Object.values(fragment));
  handshake.messageSeq = msg.message_seq;

  switch (msg.msg_type) {
    case Handshake.HandshakeType.server_hello: {
      const serverHello: ServerHello = handshake;
      const protocolVersion = new ProtocolVersion(
        fragment.server_version.major,
        fragment.server_version.minor
      );
      serverHello.server_version = protocolVersion;
      return serverHello as any;
    }
    case Handshake.HandshakeType.certificate: {
      const certificate: Certificate = handshake;
      return certificate as any;
    }
    default: {
      return handshake;
    }
  }
}
