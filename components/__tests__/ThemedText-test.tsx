import { render } from "@testing-library/react-native";

import { ThemedText } from "../ThemedText";

describe("<ThemedText />", () => {
  test("Text renders correctly in ThemedText", () => {
    const { getByText } = render(<ThemedText>Snapshot test!</ThemedText>);

    getByText("Snapshot test!");
  });

  test("Snapshot ThemedText renders correctly", () => {
    const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
