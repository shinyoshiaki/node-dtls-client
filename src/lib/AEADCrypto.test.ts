// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { expect, should, use } from "chai";
import * as semver from "semver";
import * as sinonChai from "sinon-chai";

const isGteNode10 = semver.satisfies(process.version, ">=10");

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

describe("conditional use of `node-aead-crypto` => ", () => {
  if (isGteNode10) {
    it("on NodeJS >= 10, `node-aead-crypto` should NOT be installed", () => {
      expect(() => require.resolve("node-aead-crypto")).to.throw();
    });
  } else {
    it("on NodeJS < 10, `node-aead-crypto` should be installed", () => {
      expect(() => require.resolve("node-aead-crypto")).to.not.throw();
    });
  }
});
