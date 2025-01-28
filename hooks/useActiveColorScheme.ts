import { useMemo, useState } from "react";
import { Appearance } from "react-native";
import useSettingsObject from "./useSettingsObject";
import { CustomTheme, themeDark, themeLight } from "@/constants/theme";

type ReturnType = {
  theme: CustomTheme;
  statusBarStyle: "light" | "dark";
};

const useActiveColorScheme = (): ReturnType => {
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme(),
  );

  Appearance.addChangeListener(({ colorScheme }) => {
    setSystemColorScheme(colorScheme);
  });

  const { settingsObject } = useSettingsObject();

  const activeColorScheme = useMemo(() => {
    const isSystemTheme = !settingsObject || settingsObject.theme === "system";
    return isSystemTheme ? systemColorScheme : settingsObject.theme;
  }, [settingsObject, systemColorScheme]);

  return useMemo(() => {
    const statusBarStyle = activeColorScheme === "dark" ? "light" : "dark";
    const theme = activeColorScheme === "dark" ? themeDark : themeLight;

    return {
      theme,
      statusBarStyle,
    };
  }, [activeColorScheme]);
};

export default useActiveColorScheme;
