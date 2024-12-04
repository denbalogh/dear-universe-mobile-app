import { getRandomPhrase } from "../utils";

describe("FadeInOutTextChange/utils", () => {
  it("getRandomPhrase", () => {
    const phrases = ["phrase1", "phrase2", "phrase3"];
    const randomPhrase = getRandomPhrase(phrases);
    expect(phrases).toContain(randomPhrase);
  });
});
