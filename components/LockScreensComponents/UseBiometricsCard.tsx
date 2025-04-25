import { spacing } from "@/constants/theme";
import useBiometrics from "@/hooks/useBiometrics";
import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Card, Switch, Text } from "react-native-paper";
import BiometricsIcons from "./BiometricsIcons";

type Props = {
  biometricsEnabled: boolean;
  onChange: (biometricsEnabled: boolean) => void;
};

const UseBiometricsCard = ({ biometricsEnabled, onChange }: Props) => {
  const { authenticate } = useBiometrics();

  const handleOnPress = async () => {
    const { success } = await authenticate(
      biometricsEnabled
        ? "Authenticate to disable biometrics"
        : "Authenticate to enable biometrics",
    );

    if (success) {
      onChange(!biometricsEnabled);
    }
  };
  return (
    <Card
      onPress={handleOnPress}
      mode={biometricsEnabled ? "contained" : "elevated"}
    >
      <Card.Content>
        <View style={styles.contentWrapper}>
          <Switch value={biometricsEnabled} onChange={handleOnPress} />
          <Text variant="bodyLarge" style={styles.title}>
            Use biometrics to unlock
          </Text>
          <BiometricsIcons />
        </View>
      </Card.Content>
    </Card>
  );
};

export default UseBiometricsCard;

const styles = StyleSheet.create({
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    marginStart: spacing.spaceSmall,
  },
});
