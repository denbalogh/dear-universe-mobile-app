import CodeInput from "@/components/CodeInput/CodeInput";
import {
  INVALID_CODES_MATCH_ERROR_MSG,
  INVALID_LENGTH_ERROR_MSG,
  LOCK_LENGTH,
} from "@/components/CodeInput/constants";
import {
  isCodeLengthValid,
  areCodesMatching,
} from "@/components/CodeInput/utils";
import FlingGesture from "@/components/FlingGesture/FlingGesture";
import UseBiometricsCard from "@/components/LockScreens/UseBiometricsCard";
import { spacing } from "@/constants/theme";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import useSettingsObject from "@/hooks/useSettingsObject";
import { getHashFromString } from "@/utils/crypto";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Appbar, Button, HelperText, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LockSetupScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const isKeyboardOpen = useIsKeyboardOpen();
  const { showSnackbar } = useSnackbar();
  const { updateSettingsObject } = useSettingsObject();
  const { bottom } = useSafeAreaInsets();

  const [isTyping, setIsTyping] = useState(false);
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("");

  const [codeConfirm, setCodeConfirm] = useState("");
  const [codeConfirmStatus, setCodeConfirmStatus] = useState("");

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleOnCodeChange = (text: string) => {
    setCode(text);
    setIsTyping(true);
  };

  const handleOnCodeConfirmChange = (text: string) => {
    setCodeConfirm(text);
    setIsTyping(true);
  };

  const codeConfirmInputRef = useRef<TextInput>(null);

  const handleCodeEndEditing = () => {
    if (isCodeLengthValid(code)) {
      setCodeStatus("");
      if (areCodesMatching(code, codeConfirm)) {
        setCodeConfirmStatus("");
      } else {
        setCodeConfirmStatus(INVALID_CODES_MATCH_ERROR_MSG);
      }
    } else {
      setCodeStatus(INVALID_LENGTH_ERROR_MSG);
    }
    setIsTyping(false);
  };

  const handleCodeConfirmEndEditing = () => {
    if (!isCodeLengthValid(codeConfirm)) {
      setCodeConfirmStatus(INVALID_LENGTH_ERROR_MSG);
    } else if (!areCodesMatching(code, codeConfirm)) {
      setCodeConfirmStatus(INVALID_CODES_MATCH_ERROR_MSG);
    } else {
      setCodeConfirmStatus("");
    }
    setIsTyping(false);
  };

  const handleOnCodeSubmit = () => {
    if (isCodeLengthValid(code) && !areCodesMatching(code, codeConfirm)) {
      codeConfirmInputRef.current?.focus();
    }
  };

  const areCodesValid =
    isCodeLengthValid(code) && areCodesMatching(code, codeConfirm);

  const onConfirmPress = async () => {
    const hash = await getHashFromString(code);
    updateSettingsObject({
      lockCodeHash: hash,
      lockUseBiometrics: biometricsEnabled,
    });

    showSnackbar("Lock was set up");
    router.back();
  };

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
            Setting up lock
          </Text>
          <Text variant="titleMedium">
            Type a {LOCK_LENGTH}-digit code for unlocking the app
          </Text>
          <CodeInput
            label="Code"
            code={code}
            onCodeChange={handleOnCodeChange}
            textInputProps={{
              autoFocus: true,
              style: styles.input,
              onEndEditing: handleCodeEndEditing,
              onSubmitEditing: handleOnCodeSubmit,
            }}
          />
          <HelperText
            type="error"
            visible={codeStatus !== ""}
            style={styles.helperText}
          >
            {codeStatus}
          </HelperText>
          <Text variant="titleMedium">
            Type the same {LOCK_LENGTH}-digit code to confirm
          </Text>
          <CodeInput
            label="Code again"
            code={codeConfirm}
            onCodeChange={handleOnCodeConfirmChange}
            textInputProps={{
              ref: codeConfirmInputRef,
              style: styles.input,
              onEndEditing: handleCodeConfirmEndEditing,
            }}
          />
          <HelperText
            type="error"
            visible={codeConfirmStatus !== ""}
            style={styles.helperText}
          >
            {codeConfirmStatus}
          </HelperText>
          <UseBiometricsCard
            biometricsEnabled={biometricsEnabled}
            onChange={setBiometricsEnabled}
          />
          <HelperText
            type="error"
            visible={biometricsEnabled && !areCodesValid}
            style={styles.biometricsHelpterText}
          >
            Type in the {LOCK_LENGTH}-digit code for fallback authentication
          </HelperText>
        </ScrollView>
        {!isKeyboardOpen && (
          <Button
            style={styles.confirmButton}
            mode="contained"
            disabled={!areCodesValid || isTyping}
            onPress={onConfirmPress}
          >
            Confirm
          </Button>
        )}
      </View>
    </FlingGesture>
  );
};

export default LockSetupScreen;

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
    marginTop: spacing.spaceExtraSmall,
  },
  helperText: {
    marginBottom: spacing.spaceExtraSmall,
  },
  biometricsCard: {
    marginTop: spacing.spaceSmall,
  },
  biometricsHelpterText: {
    marginTop: spacing.spaceSmall,
    textAlign: "center",
  },
  confirmButton: {
    margin: spacing.spaceMedium,
  },
});
