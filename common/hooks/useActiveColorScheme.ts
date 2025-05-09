import { useState } from "react";
import { Appearance } from "react-native";
import { useSettings } from "../providers/SettingsProvider";

type ColorScheme = "light" | "dark";

const useActiveColorScheme = () => {
  const { theme } = useSettings();

  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>(
    Appearance.getColorScheme() || "light",
  );

  Appearance.addChangeListener(({ colorScheme }) => {
    setSystemColorScheme(colorScheme || "light");
  });

  const activeColorScheme = theme === "system" ? systemColorScheme : theme;
  const statusBarStyle: ColorScheme =
    activeColorScheme === "dark" ? "light" : "dark";

  return { statusBarStyle, colorScheme: activeColorScheme };
};

export default useActiveColorScheme;
