import { HandshakeType, FragmentedHandshake } from "../../Handshake";
import { encode, types } from "binary-data";
import { Packet } from "../packet";
const { uint16be, uint8, buffer, array, uint32be } = types;

export const random = {
  gmt_unix_time: uint32be,
  random_bytes: buffer(28),
};

export class ClientHello implements Packet {
  msgType = HandshakeType.certificate;
  messageSeq: number;
  static readonly spec = {
    client_version: { major: uint8, minor: uint8 },
    random,
    session_id: buffer(uint8),
    cookie: buffer(uint8),
    cipher_suites: array(uint16be, uint16be, "bytes"),
    compression_methods: array(uint8, uint8, "bytes"),
  };

  constructor(
    public client_version: { major: number; minor: number },
    public random: { gmt_unix_time: number; random_bytes: Buffer },
    public session_id: Buffer,
    public cookie: Buffer,
    public cipher_suites: number[],
    public compression_methods: number[]
  ) {}

  static createEmpty() {
    return new ClientHello(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  private serialize() {
    const res = encode(this, ClientHello.spec).slice();
    return Buffer.from(res);
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
