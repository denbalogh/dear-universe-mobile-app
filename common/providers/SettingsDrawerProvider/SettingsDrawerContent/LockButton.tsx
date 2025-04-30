import { spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import { useSettings } from "../../SettingsProvider";

const LockButton = () => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { lockCodeHash, lockUseBiometrics } = useSettings();

  const handleOnSetupPress = () => {
    router.navigate({ pathname: "/lock/setup" });
  };

  const handleOnEditPress = () => {
    router.navigate({ pathname: "/lock/edit" });
  };

  const handleOnDeletePress = () => {
    router.navigate({ pathname: "/lock/delete" });
  };

  if (lockCodeHash) {
    return (
      <Card style={styles.wrapper} mode="contained" onPress={handleOnEditPress}>
        <Card.Title
          title="App locked"
          subtitle={lockUseBiometrics && "Unlock with biometrics enabled"}
          left={(props) => <Avatar.Icon {...props} icon="lock" />}
          subtitleNumberOfLines={2}
        />
        <Card.Actions style={styles.cardActions}>
          <Button mode="text" onPress={handleOnEditPress}>
            Edit
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={handleOnDeletePress}
          >
            Delete
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
        subtitleNumberOfLines={2}
      />
    </Card>
  );
};

export default LockButton;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.spaceMedium,
  },
  cardActions: {
    paddingTop: 0,
  },
});
