import {
  formatDateAt,
  formatFullDate,
  formatMonthName,
  formatMonthYear,
  isMonthYearFormat,
  parseDateAt,
} from "../date";

describe("utils/date", () => {
  test("parseDateAt", () => {
    const input = "1_1_2022";
    const expected = new Date(2022, 0, 1);

    const result = parseDateAt(input);
    expect(result).toEqual(expected);
  });

  test("formatDateAt", () => {
    const input = new Date(2022, 0, 1);
    const expected = "1_1_2022";

    const result = formatDateAt(input);
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
    const expected = "1st Jan. 2022";

    const result = formatFullDate(input);
    expect(result).toEqual(expected);
  });
});
