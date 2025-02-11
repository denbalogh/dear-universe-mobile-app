import { spacing } from "@/constants/theme";
import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { getApplicationName, getBuildNumber } from "react-native-device-info";
import { Text } from "react-native-paper";

const AppLogo = () => {
  const { colorScheme } = useActiveColorScheme();

  const appNameAndBuildVersion = useMemo(() => {
    const appName = getApplicationName();
    const buildNumber = getBuildNumber();
    return `${appName} v${buildNumber}`;
  }, []);

  return (
    <View style={styles.wrapper}>
      <Image
        source={
          colorScheme === "dark"
            ? require("@/assets/images/logo-dark.png")
            : require("@/assets/images/logo-light.png")
        }
        style={styles.image}
      />
      <Text variant="labelSmall">{appNameAndBuildVersion}</Text>
    </View>
  );
};

export default AppLogo;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: spacing.spaceLarge,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: spacing.spaceExtraSmall,
  },
});
