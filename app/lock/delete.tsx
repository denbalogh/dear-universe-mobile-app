import CodeInput from "@/components/CodeInput/CodeInput";
import {
  INVALID_CODE_ERROR_MSG,
  INVALID_LENGTH_ERROR_MSG,
  LOCK_LENGTH,
} from "@/components/CodeInput/constants";
import {
  isCodeHashValid,
  isCodeLengthValid,
} from "@/components/CodeInput/utils";
import BiometricsIcons from "@/components/LockScreens/BiometricsIcons";
import { spacing } from "@/constants/theme";
import { useSnackbar } from "@/contexts/SnackbarContext";
import useBiometrics from "@/hooks/useBiometrics";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useSettingsObject from "@/hooks/useSettingsObject";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Card, HelperText, Text } from "react-native-paper";

const LockDeleteScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { authenticate } = useBiometrics();

  const { updateSettingsObject, settingsObject } = useSettingsObject();
  const { lockCodeHash = "", lockUseBiometrics = false } = settingsObject || {};

  const [currentCode, setCurrentCode] = useState("");
  const [currentCodeStatus, setCurrentCodeStatus] = useState("");

  const handleConfirm = async () => {
    updateSettingsObject({
      lockCodeHash: "",
      lockUseBiometrics: false,
    });

    showSnackbar("Lock was deleted");
    router.back();
  };

  const handleCurrentCodeEndEditing = async () => {
    if (isCodeLengthValid(currentCode)) {
      if (await isCodeHashValid(currentCode, lockCodeHash)) {
        handleConfirm();
      } else {
        setCurrentCodeStatus(INVALID_CODE_ERROR_MSG);
      }
    } else {
      setCurrentCodeStatus(INVALID_LENGTH_ERROR_MSG);
    }
  };

  const handleUseBiometricsToDelete = async () => {
    const { success } = await authenticate("Authenticate to delete lock");

    if (success) {
      handleConfirm();
    }
  };

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
              <Appbar.BackAction onPress={() => router.back()} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.background,
        }}
      />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text variant="displaySmall" style={styles.headline}>
          Deleting lock
        </Text>
        <Text variant="titleMedium">
          Type current {LOCK_LENGTH}-digit code to confirm
        </Text>
        <CodeInput
          label="Current code"
          code={currentCode}
          onCodeChange={setCurrentCode}
          textInputProps={{
            autoFocus: true,
            style: styles.input,
            onEndEditing: handleCurrentCodeEndEditing,
          }}
        />
        <HelperText type="error" visible={currentCodeStatus !== ""}>
          {currentCodeStatus}
        </HelperText>
        {lockUseBiometrics && (
          <Card
            style={[styles.card, { backgroundColor: theme.colors.error }]}
            mode="elevated"
            onPress={handleUseBiometricsToDelete}
          >
            <Card.Content>
              <View style={styles.cardContentWrapper}>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onError }}
                >
                  Use biometrics to delete lock
                </Text>
                <BiometricsIcons color={theme.colors.onError} />
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default LockDeleteScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    padding: spacing.spaceMedium,
    paddingVertical: spacing.spaceSmall,
    justifyContent: "center",
  },
  headline: {
    marginBottom: spacing.spaceLarge,
  },
  input: {
    marginTop: spacing.spaceSmall,
  },
  card: {
    marginTop: spacing.spaceSmall,
  },
  cardContentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
