import {
  formatDate,
  formatFiatPriceDate,
  formatTime,
  fromDateKey,
  getDateInFuture,
  toDateKey,
  toDateKeyBackOneDay,
} from "tools/date-utils";

describe("", () => {
  test("formatDate", () => {
    const result = formatDate(1564313356000);
    expect(result).toMatchInlineSnapshot(`"Jul 28, 2019"`);
  });

  test("formatFiatPriceDate", () => {
    const result = formatFiatPriceDate(1564313356000);
    expect(result).toMatchInlineSnapshot(`"07-28-2019"`);
  });

  test("formatTime", () => {
    const result = formatTime(1564313356000);
    expect(result).toMatchInlineSnapshot(`"19:29:16"`);
  });

  test("fromDateKey", () => {
    const result = fromDateKey("1564313356000");
    expect(result).toMatchInlineSnapshot(`"6431-01-14T16:00:00.000Z"`);
  });

  test("getDateInFuture", () => {
    const result = getDateInFuture(new Date(1564313356000), 21);
    expect(result).toMatchInlineSnapshot(`"Aug 18, 2019"`);
  });

  test("toDateKey", () => {
    const result = toDateKey(1564313356000);
    expect(result).toMatchInlineSnapshot(`"Jul 28, 2019"`);
  });

  test("toDateKeyBackOneDay", () => {
    const result = toDateKeyBackOneDay(1564313356000);
    expect(result).toMatchInlineSnapshot(`"Jul 28, 2019"`);
  });
});
