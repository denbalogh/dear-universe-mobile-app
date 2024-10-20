import { render, screen } from "@testing-library/react-native";
import MoodColorSimple from "../MoodColorSimple";
import { moods } from "../values";
import { Mood } from "../types";

describe("MoodColorSimple", () => {
  test("renders correctly", () => {
    render(
      <MoodColorSimple
        mood="Happiness, Joy"
        accessibilityLabel="Happiness, Joy"
      />,
    );

    expect(screen.getByLabelText("Happiness, Joy")).toBeOnTheScreen();
  });

  test("have right colors", () => {
    Object.keys(moods).forEach((mood) => {
      render(<MoodColorSimple mood={mood as Mood} accessibilityLabel={mood} />);

      expect(screen.getByLabelText(mood)).toHaveStyle({
        backgroundColor: moods[mood as Mood].color,
      });
    });
  });
});
