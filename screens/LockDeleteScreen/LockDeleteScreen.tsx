import CodeInput from "@/common/components/CodeInput/CodeInput";
import {
  INVALID_CODE_ERROR_MSG,
  INVALID_LENGTH_ERROR_MSG,
  LOCK_LENGTH,
} from "@/common/components/CodeInput/constants";
import {
  isCodeHashValid,
  isCodeLengthValid,
} from "@/common/components/CodeInput/utils";
import FlingGesture from "@/common/components/FlingGesture";
import BiometricsIcons from "@/common/components/BiometricsIcons";
import { spacing } from "@/common/constants/theme";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import useBiometrics from "@/common/hooks/useBiometrics";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, HelperText, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "@/common/providers/SettingsProvider";
import database from "@/common/models/db";
import { useSettingsDrawer } from "@/common/providers/SettingsDrawerProvider/SettingsDrawerProvider";

const LockDeleteScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { authenticate } = useBiometrics();
  const { bottom } = useSafeAreaInsets();
  const { closeDrawer } = useSettingsDrawer();

  useEffect(closeDrawer, [closeDrawer]);

  const settings = useSettings();
  const { lockCodeHash = "", lockUseBiometrics } = settings;

  const [currentCode, setCurrentCode] = useState("");
  const [currentCodeStatus, setCurrentCodeStatus] = useState("");
  const [isCurrentCodeValid, setIsCurrentCodeValid] = useState(false);

  const handleConfirm = useCallback(async () => {
    await database.write(async () => {
      await settings.update((settings) => {
        settings.lockCodeHash = "";
        settings.lockUseBiometrics = false;
      });
    });

    showSnackbar("Lock was deleted");
    router.back();
  }, [router, showSnackbar, settings]);

  const validateCode = async (onSuccess?: () => void) => {
    if (isCodeLengthValid(currentCode)) {
      if (await isCodeHashValid(currentCode, lockCodeHash)) {
        setIsCurrentCodeValid(true);
        setCurrentCodeStatus("");
        onSuccess?.();
      } else {
        setCurrentCodeStatus(INVALID_CODE_ERROR_MSG);
        setIsCurrentCodeValid(false);
      }
    } else {
      setCurrentCodeStatus(INVALID_LENGTH_ERROR_MSG);
      setIsCurrentCodeValid(false);
    }
  };

  const handleCurrentCodeEndEditing = () => {
    validateCode();
  };

  const handleCurrentCodeSubmit = () => {
    validateCode(handleConfirm);
  };

  const handleUseBiometricsToDelete = useCallback(async () => {
    const { success } = await authenticate("Authenticate to delete lock");

    if (success) {
      handleConfirm();
    }
  }, [authenticate, handleConfirm]);

  useEffect(() => {
    if (lockUseBiometrics) {
      handleUseBiometricsToDelete();
    }
  }, [lockUseBiometrics, handleUseBiometricsToDelete]);

  return (
    <FlingGesture onFlingDown={router.back}>
      <View
        style={[
          styles.wrapper,
          { backgroundColor: theme.colors.background, paddingBottom: bottom },
        ]}
      >
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header
                style={{ backgroundColor: theme.colors.background }}
              >
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
              //   autoFocus: !lockUseBiometrics,
              style: styles.input,
              onEndEditing: handleCurrentCodeEndEditing,
              onSubmitEditing: handleCurrentCodeSubmit,
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
        <Button
          disabled={!isCurrentCodeValid}
          style={styles.confirmButton}
          mode="contained"
          onPress={handleCurrentCodeSubmit}
          textColor={theme.colors.onError}
          buttonColor={theme.colors.error}
        >
          Confirm
        </Button>
      </View>
    </FlingGesture>
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
  confirmButton: {
    margin: spacing.spaceMedium,
  },
});
