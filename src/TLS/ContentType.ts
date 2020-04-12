import * as TypeSpecs from "./TypeSpecs";

export enum ContentType {
  changeCipherSpec = 20,
  alert = 21,
  handshake = 22,
  applicationData = 23,
}
export namespace ContentType {
  export const __spec = TypeSpecs.define.Enum("uint8", ContentType);
}
