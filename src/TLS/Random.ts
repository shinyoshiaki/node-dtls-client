import * as crypto from "crypto";
import { types, encode } from "binary-data";

export class Random {
  public static readonly spec = {
    gmt_unix_time: types.uint32be,
    random_bytes: types.buffer(28),
  };

  constructor(public gmt_unix_time: number, public random_bytes: Buffer) {}

  /**
   * Creates a new Random structure and initializes it.
   */
  public static createNew(): Random {
    return new Random(Math.floor(Date.now() / 1000), crypto.randomBytes(28));
  }

  public static createEmpty(): Random {
    return new Random(null, null);
  }

  serialize() {
    return Buffer.from(encode(this, Random.spec).slice());
  }
}
