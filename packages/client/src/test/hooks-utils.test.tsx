import { renderHook } from "@testing-library/react-hooks";
import { useDateTime } from "tools/hooks-utils";

describe("hooks-utils", () => {
  /**
   * To suppress "act" error warnings, see:
   *
   * - https://react-hooks-testing-library.com/usage/advanced-hooks
   * Should be fixed with React v16.9.0
   */
  beforeAll(() => {
    // tslint:disable-next-line
    console.error = jest.fn();
  });

  test("useDateTime", async () => {
    /* Setup hook */
    const date = new Date();
    const fn = () => useDateTime(date);
    const { result } = renderHook(fn);
    expect(result.current).toBe(date);
  });
});
