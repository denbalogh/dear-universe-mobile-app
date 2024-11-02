import { render, screen } from "@testing-library/react-native";
import MoodColorComposite from "../MoodColorComposite";
import { moods } from "../values";
import { Mood } from "../types";

describe("MoodColorComposite", () => {
  test("renders correctly variant vertical", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[
          "Happiness, Joy",
          "Excitement, Energy",
          "Sadness, Indifference",
          "Anger, Frustration",
          "Calmness, Relaxation",
        ]}
        variant="vertical"
      />,
    );

    // Check if the component is rendered
    expect(screen.getByLabelText("Mood indicator")).toBeOnTheScreen();

    // Check if the moods are rendered
    expect(screen.getByLabelText("Happiness, Joy")).toBeOnTheScreen();
    expect(screen.getByLabelText("Excitement, Energy")).toBeOnTheScreen();
    expect(screen.getByLabelText("Sadness, Indifference")).toBeOnTheScreen();
    expect(screen.getByLabelText("Anger, Frustration")).toBeOnTheScreen();
    expect(screen.getByLabelText("Calmness, Relaxation")).toBeOnTheScreen();

    // Check if the component contains the expected moods
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Happiness, Joy"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Excitement, Energy"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Sadness, Indifference"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Anger, Frustration"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Calmness, Relaxation"),
    );
  });

  test("renders correctly variant horizontal", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[
          "Happiness, Joy",
          "Excitement, Energy",
          "Sadness, Indifference",
          "Anger, Frustration",
          "Calmness, Relaxation",
        ]}
        variant="horizontal"
      />,
    );

    // Check if the component is rendered
    expect(screen.getByLabelText("Mood indicator")).toBeOnTheScreen();

    // Check if the moods are rendered
    expect(screen.getByLabelText("Happiness, Joy")).toBeOnTheScreen();
    expect(screen.getByLabelText("Excitement, Energy")).toBeOnTheScreen();
    expect(screen.getByLabelText("Sadness, Indifference")).toBeOnTheScreen();
    expect(screen.getByLabelText("Anger, Frustration")).toBeOnTheScreen();
    expect(screen.getByLabelText("Calmness, Relaxation")).toBeOnTheScreen();

    // Check if the component contains the expected moods
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Happiness, Joy"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Excitement, Energy"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Sadness, Indifference"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Anger, Frustration"),
    );
    expect(screen.getByLabelText("Mood indicator")).toContainElement(
      screen.getByLabelText("Calmness, Relaxation"),
    );
  });

  test("returns null on empty moods", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[]}
        variant="vertical"
      />,
    );

    expect(screen.queryByLabelText("Mood indicator")).not.toBeOnTheScreen();

    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[]}
        variant="horizontal"
      />,
    );

    expect(screen.queryByLabelText("Mood indicator")).not.toBeOnTheScreen();
  });

  test("multiple moods of the same type are rendered variant vertical", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[
          "Happiness, Joy",
          "Anger, Frustration",
          "Happiness, Joy",
          "Happiness, Joy",
          "Anger, Frustration",
        ]}
        variant="vertical"
      />,
    );

    expect(screen.getByTestId("Happiness, Joy-0")).toBeOnTheScreen();
    expect(screen.getByTestId("Anger, Frustration-1")).toBeOnTheScreen();
    expect(screen.getByTestId("Happiness, Joy-2")).toBeOnTheScreen();
    expect(screen.getByTestId("Happiness, Joy-3")).toBeOnTheScreen();
    expect(screen.getByTestId("Anger, Frustration-4")).toBeOnTheScreen();
  });

  test("multiple moods of the same type are rendered variant horizontal", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={[
          "Happiness, Joy",
          "Anger, Frustration",
          "Happiness, Joy",
          "Happiness, Joy",
          "Anger, Frustration",
        ]}
        variant="horizontal"
      />,
    );

    expect(screen.getByTestId("Happiness, Joy-0")).toBeOnTheScreen();
    expect(screen.getByTestId("Anger, Frustration-1")).toBeOnTheScreen();
    expect(screen.getByTestId("Happiness, Joy-2")).toBeOnTheScreen();
    expect(screen.getByTestId("Happiness, Joy-3")).toBeOnTheScreen();
    expect(screen.getByTestId("Anger, Frustration-4")).toBeOnTheScreen();
  });

  test("have right colors", () => {
    render(
      <MoodColorComposite
        accessibilityLabel="Mood indicator"
        moods={Object.keys(moods) as Mood[]}
        variant="vertical"
      />,
    );

    Object.keys(moods).forEach((mood) => {
      expect(screen.getByLabelText(mood)).toHaveStyle({
        backgroundColor: moods[mood as Mood].color,
      });
    });
  });
});
