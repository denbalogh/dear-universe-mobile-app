import {
  formatDateId,
  formatFullDate,
  formatMonthName,
  formatMonthYear,
  isMonthYearFormat,
  parseDateId,
} from "../date";

describe("utils/date", () => {
  test("parseDateId", () => {
    const input = "1_1_2022";
    const expected = new Date(2022, 0, 1);

    const result = parseDateId(input);
    expect(result).toEqual(expected);
  });

  test("formatDateId", () => {
    const input = new Date(2022, 0, 1);
    const expected = "1_1_2022";

    const result = formatDateId(input);
    expect(result).toEqual(expected);
  });

  test("formatMonthYear", () => {
    const input = new Date(2022, 0, 1);
    const expected = "January 2022";

    const result = formatMonthYear(input);
    expect(result).toEqual(expected);
  });

  test("formatMonthName", () => {
    const input = new Date(2022, 0, 1);
    const expected = "January";

    const result = formatMonthName(input);
    expect(result).toEqual(expected);
  });

  test("isMonthYearFormat", () => {
    const input = "January 2022";

    const result = isMonthYearFormat(input);
    expect(result).toBe(true);
  });

  test("formatFullDate", () => {
    const input = new Date(2022, 0, 1);
    const expected = "1st January 2022";

    const result = formatFullDate(input);
    expect(result).toEqual(expected);
  });
});
