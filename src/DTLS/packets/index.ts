import * as Handshake from "../Handshake";
import { ProtocolVersion } from "../../TLS/ProtocolVersion";
import { ServerHello } from "./server/hello";
import { decode } from "binary-data";

export function parseMessage(msg: Handshake.FragmentedHandshake) {
  switch (msg.msg_type) {
    case Handshake.HandshakeType.server_hello: {
      const {
        server_version,
        random,
        session_id,
        cipher_suite,
        compression_method,
      } = decode(msg.fragment, ServerHello.spec);
      const serverHello = ServerHello.createEmpty();
      const protocolVersion = ProtocolVersion.createEmpty();
      protocolVersion.major = server_version.major;
      protocolVersion.minor = server_version.minor;
      serverHello.server_version = protocolVersion;
      serverHello.random = random;
      serverHello.session_id = session_id;
      serverHello.cipher_suite = cipher_suite;
      serverHello.compression_method = compression_method;
      serverHello.messageSeq = msg.message_seq;
      return serverHello as any;
    }
    default:
      const handshake = Handshake.Handshake.fromFragment(msg);
      return handshake;
  }
}
