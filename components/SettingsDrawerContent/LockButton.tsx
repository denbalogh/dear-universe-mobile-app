import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useSettingsObject from "@/hooks/useSettingsObject";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";

type Props = {
  closeSettingsDrawer: () => void;
};

const LockButton = ({ closeSettingsDrawer }: Props) => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { settingsObject } = useSettingsObject();
  const { lockCodeHash, lockUseBiometrics = false } = settingsObject || {};

  const handleOnSetupPress = () => {
    router.navigate({ pathname: "/lock/setup" });
    closeSettingsDrawer();
  };

  const handleOnEditPress = () => {
    router.navigate({ pathname: "/lock/edit" });
    closeSettingsDrawer();
  };

  const handleOnDeletePress = () => {
    router.navigate({ pathname: "/lock/delete" });
    closeSettingsDrawer();
  };

  if (lockCodeHash) {
    return (
      <Card style={styles.wrapper} mode="outlined">
        <Card.Title
          title="App locked"
          subtitle={lockUseBiometrics && "Unlock with biometrics enabled"}
          left={(props) => <Avatar.Icon {...props} icon="lock" />}
        />
        <Card.Actions style={{ paddingTop: 0 }}>
          <Button mode="text" onPress={handleOnEditPress}>
            Edit lock
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={handleOnDeletePress}
          >
            Delete lock
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <Card style={styles.wrapper} onPress={handleOnSetupPress} mode="elevated">
      <Card.Title
        title="App unlocked"
        subtitle="Set up a lock for entering the app"
        left={(props) => <Avatar.Icon {...props} icon="lock-open" />}
      />
    </Card>
  );
};

export default LockButton;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.spaceMedium,
  },
});
