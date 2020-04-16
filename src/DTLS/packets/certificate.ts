import { HandshakeType, FragmentedHandshake } from "../Handshake";
import { encode, types } from "binary-data";
import { Packet } from "./packet";
const { array, uint24be, buffer } = types;

export class Certificate implements Packet {
  msgType = HandshakeType.certificate;
  messageSeq: number;
  static readonly spec = {
    certificateList: array(buffer(uint24be), uint24be, "bytes"),
  };

  constructor(public certificateList: Buffer[]) {}

  static createEmpty() {
    return new Certificate(undefined);
  }

  private serialize() {
    return Buffer.from(encode(this, Certificate.spec).slice());
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
