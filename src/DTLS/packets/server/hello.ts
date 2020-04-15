import { HandshakeType, FragmentedHandshake } from "../../Handshake";
import { encode, types } from "binary-data";
const { uint16be, buffer, uint8 } = types;

export class ServerHello {
  msgType = HandshakeType.server_hello;
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
    return new FragmentedHandshake(
      this.msgType,
      body.length,
      this.messageSeq,
      0,
      body
    );
  }
}
