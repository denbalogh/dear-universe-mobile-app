import { appendDays, createDaysUntilDate } from "../utils";

describe("createDaysUntilDate", () => {
  test("untilDate is current day", () => {
    const untilDate = new Date(2024, 9, 1);
    const extraDays = 5;
    const startDay = new Date(2024, 9, 1);

    const expectedDays = [
      "1_10_2024",
      "September 2024",
      "30_9_2024",
      "29_9_2024",
      "28_9_2024",
      "27_9_2024",
      "26_9_2024",
    ];

    const result = createDaysUntilDate(untilDate, extraDays, startDay);
    expect(result).toEqual(expectedDays);
  });

  test("untilDay is 5 days ahead from starting day", () => {
    const untilDate = new Date(2024, 9, 1);
    const extraDays = 5;
    const startDay = new Date(2024, 9, 6);

    const expectedDays = [
      "6_10_2024",
      "5_10_2024",
      "4_10_2024",
      "3_10_2024",
      "2_10_2024",
      "1_10_2024",
      "September 2024",
      "30_9_2024",
      "29_9_2024",
      "28_9_2024",
      "27_9_2024",
      "26_9_2024",
    ];

    const result = createDaysUntilDate(untilDate, extraDays, startDay);
    expect(result).toEqual(expectedDays);
  });
});

describe("appendDays", () => {
  test("appends 5 days", () => {
    const days = ["2_10_2024"];
    const COUNT = 5;

    const expectedDays = [
      "2_10_2024",
      "1_10_2024",
      "September 2024",
      "30_9_2024",
      "29_9_2024",
      "28_9_2024",
      "27_9_2024",
    ];

    const result = appendDays(days, COUNT);
    expect(result).toEqual(expectedDays);
  });
});
