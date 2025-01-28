import CodeInput from "@/components/CodeInput/CodeInput";
import {
  INVALID_CODE_ERROR_MSG,
  INVALID_LENGTH_ERROR_MSG,
} from "@/components/CodeInput/constants";
import {
  isCodeHashValid,
  isCodeLengthValid,
} from "@/components/CodeInput/utils";
import BiometricsIcons from "@/components/LockScreens/BiometricsIcons";
import { LOCK_SCREEN_NAVIGATE_TO_APP } from "@/constants/screens";
import { spacing } from "@/constants/theme";
import useAppState from "@/hooks/useAppState";
import useBiometrics from "@/hooks/useBiometrics";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useSettingsObject from "@/hooks/useSettingsObject";
import { LockSearchTermParams } from "@/types/lockScreen";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Card, HelperText, Text } from "react-native-paper";

const LockScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const appState = useAppState();
  const { authenticate } = useBiometrics();

  const { navigateTo } = useLocalSearchParams<LockSearchTermParams>();

  const { settingsObject } = useSettingsObject();
  const { lockCodeHash = "", lockUseBiometrics = false } = settingsObject || {};

  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("");

  // Prevent going back from lock screen with hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleConfirm = useCallback(async () => {
    if (navigateTo === LOCK_SCREEN_NAVIGATE_TO_APP.navigateTo) {
      router.replace({ pathname: "/app" });
    } else {
      router.back();
    }
  }, [navigateTo, router]);

  const handleCodeEndEditing = async () => {
    if (isCodeLengthValid(code)) {
      if (await isCodeHashValid(code, lockCodeHash)) {
        handleConfirm();
      } else {
        setCodeStatus(INVALID_CODE_ERROR_MSG);
      }
    } else {
      setCodeStatus(INVALID_LENGTH_ERROR_MSG);
    }
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
        }}
      />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text variant="displaySmall" style={styles.headline}>
          App is locked
        </Text>
        <Text variant="titleMedium">Type 6-digit code to unlock</Text>
        <CodeInput
          label="Code"
          code={code}
          onCodeChange={setCode}
          textInputProps={{
            autoFocus: !lockUseBiometrics,
            style: styles.input,
            onEndEditing: handleCodeEndEditing,
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
});
