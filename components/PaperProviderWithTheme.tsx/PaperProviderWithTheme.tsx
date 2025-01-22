import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import React, { ReactNode, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";

type Props = {
  children: ReactNode;
};

const PaperProviderWithTheme = ({ children }: Props) => {
  const { theme, statusBarStyle } = useActiveColorScheme();

  useEffect(() => {
    const setRootBackgroundColor = async () =>
      await setBackgroundColorAsync(theme.colors.surface); // For keyboard background color

    setRootBackgroundColor();
  }, [theme]);

  return (
    <PaperProvider theme={theme}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.background },
        ]}
      />
      <StatusBar translucent={true} style={statusBarStyle} />
      {children}
    </PaperProvider>
  );
};

export default PaperProviderWithTheme;
