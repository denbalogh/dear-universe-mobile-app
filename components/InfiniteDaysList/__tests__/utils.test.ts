import { appendDays, createDaysUntilDate } from "../utils";

describe("createDaysUntilDate", () => {
  test("untilDate is current day", () => {
    const untilDate = new Date(2024, 9, 1);
    const extraDays = 5;
    const startDay = new Date(2024, 9, 1);

    const expectedDays = [
      "1/10/2024",
      "September 2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
    ];

    const result = createDaysUntilDate(untilDate, extraDays, startDay);
    expect(result).toEqual(expectedDays);
  });

  test("untilDay is 5 days ahead from starting day", () => {
    const untilDate = new Date(2024, 9, 1);
    const extraDays = 5;
    const startDay = new Date(2024, 9, 6);

    const expectedDays = [
      "6/10/2024",
      "5/10/2024",
      "4/10/2024",
      "3/10/2024",
      "2/10/2024",
      "1/10/2024",
      "September 2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
    ];

    const result = createDaysUntilDate(untilDate, extraDays, startDay);
    expect(result).toEqual(expectedDays);
  });
});

describe("appendDays", () => {
  test("appends 5 days", () => {
    const days = ["2/10/2024"];
    const COUNT = 5;

    const expectedDays = [
      "2/10/2024",
      "1/10/2024",
      "September 2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
    ];

    const result = appendDays(days, COUNT);
    expect(result).toEqual(expectedDays);
  });
});
