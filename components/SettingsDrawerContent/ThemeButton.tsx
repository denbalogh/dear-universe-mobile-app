import { SettingsTheme } from "@/constants/settings";
import useSettingsObject from "@/hooks/useSettingsObject";
import { capitalize } from "lodash";
import React from "react";
import { Button } from "react-native-paper";
import CustomMenu from "../CustomMenu/CustomMenu";

const ThemeButton = () => {
  const { settingsObject, updateSettingsObject } = useSettingsObject();
  const colorScheme = settingsObject?.theme || "system";
  const activeIcon = {
    system: "theme-light-dark",
    light: "weather-sunny",
    dark: "weather-night",
  }[colorScheme];

  const onItemPress = (colorScheme: SettingsTheme) => {
    updateSettingsObject({ theme: colorScheme });
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
