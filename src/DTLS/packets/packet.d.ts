import { HandshakeType, FragmentedHandshake } from "../Handshake";

export interface Packet {
  msgType: HandshakeType;
  messageSeq: number;
  toFragment: () => FragmentedHandshake;
}
