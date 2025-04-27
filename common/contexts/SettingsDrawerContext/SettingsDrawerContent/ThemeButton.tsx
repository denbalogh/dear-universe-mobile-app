import capitalize from "lodash/capitalize";
import React from "react";
import { Button } from "react-native-paper";
import CustomMenu from "../../../components/CustomMenu";
import { SettingsTheme } from "@/common/types/Settings";

const ThemeButton = () => {
  const colorScheme = "system"; // #TODO: Replace with actual color scheme
  const activeIcon = {
    system: "theme-light-dark",
    light: "weather-sunny",
    dark: "weather-night",
  }[colorScheme];

  const onItemPress = (colorScheme: SettingsTheme) => {
    // updateSettingsObject({ theme: colorScheme });
  };

  return (
    <CustomMenu
      menuItems={[
        {
          title: "System",
          leadingIcon: "theme-light-dark",
          onPress: () => onItemPress("system"),
        },
        {
          title: "Light",
          leadingIcon: "weather-sunny",
          onPress: () => onItemPress("light"),
        },
        {
          title: "Dark",
          leadingIcon: "weather-night",
          onPress: () => onItemPress("dark"),
        },
      ]}
    >
      {({ openMenu }) => (
        <Button icon={activeIcon} mode="elevated" onPress={openMenu}>
          {capitalize(colorScheme)}
        </Button>
      )}
    </CustomMenu>
  );
};

export default ThemeButton;
