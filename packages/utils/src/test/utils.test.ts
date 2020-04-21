import { assertUnreachable } from "../utils";

describe("utils", () => {
  test("assertUnreachable", () => {
    expect(() => assertUnreachable({} as never)).toThrow();
  });
});
