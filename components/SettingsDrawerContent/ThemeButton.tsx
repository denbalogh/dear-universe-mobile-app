import { SettingsTheme } from "@/constants/settings";
import useSettingsObject from "@/hooks/useSettingsObject";
import { capitalize } from "lodash";
import React, { useState } from "react";
import { Button, Menu, MenuItemProps } from "react-native-paper";

const ThemeButton = () => {
  const [visible, setVisible] = useState(false);
  const showMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { settingsObject, updateSettingsObject } = useSettingsObject();
  const colorScheme = settingsObject?.theme || "system";
  const activeIcon = {
    system: "theme-light-dark",
    light: "weather-sunny",
    dark: "weather-night",
  }[colorScheme];

  const onItemPress = (colorScheme: SettingsTheme) => {
    updateSettingsObject({ theme: colorScheme });
    closeMenu();
  };

  const menuItems: MenuItemProps[] = [
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
  ];

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button icon={activeIcon} mode="elevated" onPress={showMenu}>
          {capitalize(colorScheme)}
        </Button>
      }
    >
      {menuItems.map((props, index) => (
        <Menu.Item {...props} key={index} />
      ))}
    </Menu>
  );
};

export default ThemeButton;
