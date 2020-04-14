import * as Handshake from "../Handshake";
import { ProtocolVersion } from "../../TLS/ProtocolVersion";

const {
  decode,
  encode,
  types: { uint16be, buffer, uint8 },
} = require("binary-data");

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

class ServerHello {
  msgType = Handshake.HandshakeType.server_hello;
  messageSeq: number;
  public static readonly spec = {
    server_version: { major: uint8, minor: uint8 },
    random: buffer(32),
    session_id: buffer(uint8),
    cipher_suite: uint16be,
    compression_method: uint8,
  };

  constructor(
    public server_version: any,
    public random: any,
    public session_id: Buffer,
    public cipher_suite: number,
    public compression_method: number
  ) {}

  static createEmpty() {
    return new ServerHello(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  private serialize() {
    return Buffer.from(encode(this, ServerHello.spec).slice());
  }

  toFragment() {
    const body = this.serialize();
    return new Handshake.FragmentedHandshake(
      this.msgType,
      body.length,
      this.messageSeq,
      0,
      body
    );
  }
}
