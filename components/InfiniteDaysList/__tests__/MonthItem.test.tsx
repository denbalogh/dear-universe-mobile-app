import { render, screen } from "@testing-library/react-native";
import MonthItem from "../MonthItem";

describe("InfiniteDaysList/MonthItem", () => {
  test("should render correctly", () => {
    render(<MonthItem monthName="January" />);

    expect(screen.getByText("January")).toBeOnTheScreen();
  });
});
