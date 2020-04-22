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
    expect(result.slice(2)).toMatchInlineSnapshot(`":29:16"`);
  });

  test("fromDateKey", () => {
    const result = fromDateKey("1564313356000");
    expect(new Date(1564313356000).getTime() === result.toDate().getTime());
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
