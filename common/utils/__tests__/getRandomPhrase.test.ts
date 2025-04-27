import { getRandomPhrase } from "../getRandomPhrase";

describe("getRandomPhrase", () => {
  it("should pick random phrase from the array of phrases", () => {
    const phrases = ["phrase1", "phrase2", "phrase3"];
    const randomPhrase = getRandomPhrase(phrases);
    expect(phrases).toContain(randomPhrase);
  });
});
