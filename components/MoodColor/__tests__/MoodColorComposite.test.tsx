import { render, screen } from "@testing-library/react-native";
import MoodColorComposite from "../MoodColorComposite";

describe("MoodColorComposite", () => {
  test("renders correctly", () => {
    render(
      <MoodColorComposite
        aria-label="Mood indicator"
        moods={[
          { mood: "Happiness, Joy", count: 3 },
          { mood: "Excitement, Energy", count: 2 },
          { mood: "Serenity, Balance", count: 1 },
          { mood: "Sadness, Indifference", count: 2 },
          { mood: "Anger, Frustration", count: 1 },
          { mood: "Calmness, Relaxation", count: 1 },
        ]}
      />,
    );

    // Check if the component is rendered
    expect(screen.getByLabelText("Mood indicator")).toBeOnTheScreen();

    // Check if the moods are rendered
    expect(screen.getByLabelText("Happiness, Joy 3")).toBeOnTheScreen();
    expect(screen.getByLabelText("Excitement, Energy 2")).toBeOnTheScreen();
    expect(screen.getByLabelText("Serenity, Balance 1")).toBeOnTheScreen();
    expect(screen.getByLabelText("Sadness, Indifference 2")).toBeOnTheScreen();
    expect(screen.getByLabelText("Anger, Frustration 1")).toBeOnTheScreen();
    expect(screen.getByLabelText("Calmness, Relaxation 1")).toBeOnTheScreen();

    // Check if the component contains the expected moods
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Happiness, Joy 3"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Excitement, Energy 2"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Serenity, Balance 1"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Sadness, Indifference 2"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Anger, Frustration 1"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Calmness, Relaxation 1"),
    );
  });

  test("returns null on empty moods", () => {
    render(<MoodColorComposite aria-label="Mood indicator" moods={[]} />);

    expect(screen.queryByLabelText("Mood indicator")).not.toBeOnTheScreen();
  });
});
