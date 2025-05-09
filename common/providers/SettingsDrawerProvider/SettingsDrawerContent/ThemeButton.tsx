import capitalize from "lodash/capitalize";
import React from "react";
import { Button } from "react-native-paper";
import CustomMenu from "../../../components/CustomMenu";
import { SettingsTheme } from "@/common/types/Settings";
import database from "@/common/models/db";
import { useSettings } from "@/common/providers/SettingsProvider";

const ThemeButton = () => {
  const settings = useSettings();

  const colorScheme = settings.theme;
  const activeIcon = {
    system: "theme-light-dark",
    light: "weather-sunny",
    dark: "weather-night",
  }[settings.theme];

  const onItemPress = async (colorScheme: SettingsTheme) => {
    if (!settings) return;

    await database.write(async () => {
      await settings.update((settings) => {
        settings.theme = colorScheme;
      });
    });
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
        <Button
          icon={activeIcon}
          mode="elevated"
          onPress={openMenu}
          loading={!settings}
        >
          {capitalize(colorScheme)}
        </Button>
      )}
    </CustomMenu>
  );
};

export default ThemeButton;
