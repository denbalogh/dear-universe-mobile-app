import { render, screen } from "@testing-library/react-native";
import MoodColorSimple from "../MoodColorSimple";

describe("MoodColorSimple", () => {
  test("renders correctly", () => {
    render(
      <MoodColorSimple mood="Happiness, Joy" aria-label="Happiness, Joy" />,
    );

    expect(screen.getByLabelText("Happiness, Joy")).toBeOnTheScreen();
  });
});
