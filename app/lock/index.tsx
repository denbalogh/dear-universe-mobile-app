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
import useAppState from "@/hooks/useAppState";
import useBiometrics from "@/hooks/useBiometrics";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useSettingsObject from "@/hooks/useSettingsObject";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, HelperText, Text } from "react-native-paper";

const LockScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const appState = useAppState();
  const { authenticate } = useBiometrics();

  const { settingsObject } = useSettingsObject();
  const { lockCodeHash = "", lockUseBiometrics = false } = settingsObject || {};

  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Prevent going back from lock screen with hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          BackHandler.exitApp();
          return true;
        },
      );
      return () => subscription.remove();
    }, []),
  );

  const handleConfirm = useCallback(async () => {
    router.back();
  }, [router]);

  const validateCode = async (onSuccess?: () => void) => {
    if (isCodeLengthValid(code)) {
      if (await isCodeHashValid(code, lockCodeHash)) {
        setIsCodeValid(true);
        setCodeStatus("");
        onSuccess?.();
      } else {
        setCodeStatus(INVALID_CODE_ERROR_MSG);
        setIsCodeValid(false);
      }
    } else {
      setCodeStatus(INVALID_LENGTH_ERROR_MSG);
      setIsCodeValid(false);
    }
  };

  const handleCodeEndEditing = () => {
    validateCode();
  };

  const handleCodeSubmit = () => {
    validateCode(handleConfirm);
  };

  const handleUseBiometricsToUnlock = useCallback(async () => {
    const { success } = await authenticate("Authenticate to unlock the app");

    if (success) {
      handleConfirm();
    }
  }, [authenticate, handleConfirm]);

  useEffect(() => {
    if (lockUseBiometrics && appState === "active") {
      handleUseBiometricsToUnlock();
    }
  }, [lockUseBiometrics, handleUseBiometricsToUnlock, appState]);

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
              <Appbar.Content title="" />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.background,
          animation: "fade",
        }}
      />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text variant="displaySmall" style={styles.headline}>
          App is locked
        </Text>
        <Text variant="titleMedium">
          Type {LOCK_LENGTH}-digit code to unlock
        </Text>
        <CodeInput
          label="Code"
          code={code}
          onCodeChange={setCode}
          textInputProps={{
            autoFocus: !lockUseBiometrics,
            style: styles.input,
            onEndEditing: handleCodeEndEditing,
            onSubmitEditing: handleCodeSubmit,
          }}
        />
        <HelperText type="error" visible={codeStatus !== ""}>
          {codeStatus}
        </HelperText>
        {lockUseBiometrics && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            mode="elevated"
            onPress={handleUseBiometricsToUnlock}
          >
            <Card.Content style={styles.cardContentWrapper}>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onPrimaryContainer }}
              >
                Use biometrics to unlock
              </Text>
              <BiometricsIcons color={theme.colors.onPrimaryContainer} />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      <Button
        disabled={!isCodeValid}
        style={styles.confirmButton}
        mode="contained"
        onPress={handleCodeSubmit}
      >
        Confirm
      </Button>
    </View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    padding: spacing.spaceMedium,
    paddingVertical: spacing.spaceSmall,
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
  confirmButton: {
    margin: spacing.spaceMedium,
  },
});
