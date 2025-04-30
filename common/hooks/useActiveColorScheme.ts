import { useMemo, useState } from "react";
import { Appearance } from "react-native";
import { useSettings } from "../providers/SettingsProvider";

type ColorScheme = "light" | "dark";

type ReturnType = {
  statusBarStyle: ColorScheme;
  colorScheme: ColorScheme;
};

const useActiveColorScheme = (): ReturnType => {
  const { theme } = useSettings();

  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme(),
  );

  Appearance.addChangeListener(({ colorScheme }) => {
    setSystemColorScheme(colorScheme);
  });

  const activeColorScheme = useMemo(() => {
    return theme === "system" ? systemColorScheme : theme;
  }, [theme, systemColorScheme]);

  return useMemo(() => {
    const statusBarStyle = activeColorScheme === "dark" ? "light" : "dark";
    const colorScheme = activeColorScheme as ColorScheme;

    return {
      statusBarStyle,
      colorScheme,
    };
  }, [activeColorScheme]);
};

export default useActiveColorScheme;
