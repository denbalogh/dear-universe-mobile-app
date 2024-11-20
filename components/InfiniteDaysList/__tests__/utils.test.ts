import {
  appendDays,
  canPrependDays,
  createInitDays,
  prependDays,
} from "../utils";

describe("createInitDays", () => {
  test("startDate is the last date", () => {
    const startDate = new Date(2024, 9, 1);
    const COUNT = 5;
    const lastDate = new Date(2024, 9, 1);

    const expectedDays = [
      "1/10/2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
    ];

    const result = createInitDays(startDate, COUNT, lastDate);
    expect(result).toEqual(expectedDays);
  });

  test("startDate is 2 days behind the the last date", () => {
    const startDate = new Date(2024, 8, 29);
    const COUNT = 5;
    const lastDate = new Date(2024, 9, 2);

    const expectedDays = [
      "2/10/2024",
      "1/10/2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
      "25/9/2024",
      "24/9/2024",
    ];

    const result = createInitDays(startDate, COUNT, lastDate);
    expect(result).toEqual(expectedDays);
  });

  test("correct dates around the startDate", () => {
    const startDate = new Date(2024, 9, 1);
    const COUNT = 5;

    const expectedDays = [
      "6/10/2024",
      "5/10/2024",
      "4/10/2024",
      "3/10/2024",
      "2/10/2024",
      "1/10/2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
    ];

    const result = createInitDays(startDate, COUNT);
    expect(result).toEqual(expectedDays);
  });
});

describe("appendDays", () => {
  test("appends 5 days", () => {
    const days = ["26/9/2024"];
    const COUNT = 5;

    const expectedDays = [
      "26/9/2024",
      "25/9/2024",
      "24/9/2024",
      "23/9/2024",
      "22/9/2024",
      "21/9/2024",
    ];

    const result = appendDays(days, COUNT);
    expect(result).toEqual(expectedDays);
  });
});

describe("prependDays", () => {
  test("prepends 5 days close to the starting day", () => {
    const days = ["26/9/2024"];
    const COUNT = 5;
    const firstDateForTesting = new Date(2024, 8, 28);

    const expectedDays = ["28/9/2024", "27/9/2024", "26/9/2024"];

    const result = prependDays(days, COUNT, firstDateForTesting);
    expect(result).toEqual(expectedDays);
  });

  test("prepends 5 days far from the starting day", () => {
    const days = ["26/9/2024"];
    const COUNT = 5;

    const expectedDays = [
      "1/10/2024",
      "30/9/2024",
      "29/9/2024",
      "28/9/2024",
      "27/9/2024",
      "26/9/2024",
    ];

    const result = prependDays(days, COUNT);
    expect(result).toEqual(expectedDays);
  });
});

describe("canPrependDays", () => {
  test("can prepend days", () => {
    const days = ["26/9/2024"];
    const firstDateForTesting = new Date(2024, 8, 28);

    const result = canPrependDays(days, firstDateForTesting);
    expect(result).toBe(true);
  });

  test("cannot prepend days", () => {
    const days = ["26/9/2024"];
    const firstDateForTesting = new Date(2024, 8, 26);

    const result = canPrependDays(days, firstDateForTesting);
    expect(result).toBe(false);
  });
});
