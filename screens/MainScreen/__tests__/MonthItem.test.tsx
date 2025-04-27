import { render, screen } from "@testing-library/react-native";
import MonthItem from "../CalendarList/MonthItem";

describe("CalendarList/MonthItem", () => {
  test("should render correctly", () => {
    render(<MonthItem monthName="January" />);

    expect(screen.getByText("January")).toBeOnTheScreen();
  });
});
