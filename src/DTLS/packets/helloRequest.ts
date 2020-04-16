import { HandshakeType, FragmentedHandshake } from "../Handshake";
import { encode } from "binary-data";
import { Packet } from "./packet";

export class HelloRequest implements Packet {
  msgType = HandshakeType.certificate;
  messageSeq: number;
  static readonly spec = {};

  static createEmpty() {
    return new HelloRequest();
  }

  private serialize() {
    return Buffer.from(encode(this, HelloRequest.spec).slice());
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
