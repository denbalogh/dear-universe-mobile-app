import { renderHook } from "@testing-library/react-native";
import { getMoodColor, getMoodOrder, useSortedMoods } from "../values";
import { moods } from "../values";
import { Mood } from "../types";

describe("useSortedMoods", () => {
  test("returns moods sorted by order 1", () => {
    const moods = {
      "Happiness, Joy": { color: "#F4D03F", order: 1 },
      "Excitement, Energy": { color: "#E59866", order: 2 },
      "Calmness, Relaxation": { color: "#48C9B0", order: 3 },
      "Anger, Frustration": { color: "#CB4335", order: 4 },
      "Sadness, Indifference": { color: "#A6ACAF", order: 5 },
    };
    const expected = [
      "Happiness, Joy",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Anger, Frustration",
      "Sadness, Indifference",
    ];

    const { result } = renderHook(() => useSortedMoods(moods));
    expect(result.current).toEqual(expected);
  });

  test("returns moods sorted by order 2", () => {
    const moods = {
      "Happiness, Joy": { color: "#F4D03F", order: 4 },
      "Excitement, Energy": { color: "#E59866", order: 2 },
      "Calmness, Relaxation": { color: "#48C9B0", order: 3 },
      "Anger, Frustration": { color: "#CB4335", order: 1 },
      "Sadness, Indifference": { color: "#A6ACAF", order: 5 },
    };
    const expected = [
      "Anger, Frustration",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Happiness, Joy",
      "Sadness, Indifference",
    ];

    const { result } = renderHook(() => useSortedMoods(moods));
    expect(result.current).toEqual(expected);
  });
});

describe("getMoodColor", () => {
  test("return correct moods colors", () => {
    for (const [key, value] of Object.entries(moods)) {
      expect(getMoodColor(key as Mood)).toEqual(value["color"]);
    }
  });
});

describe("getMoodOrder", () => {
  test("return correct moods order", () => {
    for (const [key, value] of Object.entries(moods)) {
      expect(getMoodOrder(key as Mood)).toEqual(value["order"]);
    }
  });
});
