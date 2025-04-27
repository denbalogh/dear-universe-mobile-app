import { useMemo, useState } from "react";
import { Appearance } from "react-native";

type ColorScheme = "light" | "dark";

type ReturnType = {
  statusBarStyle: ColorScheme;
  colorScheme: ColorScheme;
};

const useActiveColorScheme = (): ReturnType => {
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme(),
  );

  Appearance.addChangeListener(({ colorScheme }) => {
    setSystemColorScheme(colorScheme);
  });

  // const activeColorScheme = useMemo(() => {
  //   const isSystemTheme = !settingsObject || settingsObject.theme === "system";
  //   return isSystemTheme ? systemColorScheme : settingsObject.theme;
  // }, [settingsObject, systemColorScheme]);

  // return useMemo(() => {
  //   const statusBarStyle = activeColorScheme === "dark" ? "light" : "dark";
  //   const colorScheme = activeColorScheme as ColorScheme;

  //   return {
  //     statusBarStyle,
  //     colorScheme,
  //   };
  // }, [activeColorScheme]);

  // #TODO - Uncomment the above code when settingsObject is available
  return {
    statusBarStyle: systemColorScheme === "dark" ? "light" : "dark",
    colorScheme: systemColorScheme as ColorScheme,
  };
};

export default useActiveColorScheme;
