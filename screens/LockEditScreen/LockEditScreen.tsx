import CodeInput from "@/common/components/CodeInput/CodeInput";
import {
  INVALID_CODE_ERROR_MSG,
  INVALID_CODES_MATCH_ERROR_MSG,
  INVALID_LENGTH_ERROR_MSG,
  LOCK_LENGTH,
} from "@/common/components/CodeInput/constants";
import {
  isCodeHashValid,
  isCodeLengthValid,
  areCodesMatching,
} from "@/common/components/CodeInput/utils";
import FlingGesture from "@/common/components/FlingGesture";
import UseBiometricsCard from "@/common/components/UseBiometricsCard";
import { spacing } from "@/common/constants/theme";
import { useSnackbar } from "@/common/contexts/SnackbarContext";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { getHashFromString } from "@/common/utils/crypto";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  HelperText,
  Switch,
  Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LockEditScreen = () => {
  const theme = useCustomTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { bottom } = useSafeAreaInsets();

  //   const { lockCodeHash = "", lockUseBiometrics = false } = settingsObject || {};

  const [codeChangeEnabled, setCodeChangeEnabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [currentCode, setCurrentCode] = useState("");
  const [currentCodeStatus, setCurrentCodeStatus] = useState("");
  const [isCurrentCodeValid, setIsCurrentCodeValid] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newCodeStatus, setNewCodeStatus] = useState("");

  const [newCodeConfirm, setNewCodeConfirm] = useState("");
  const [newCodeConfirmStatus, setNewCodeConfirmStatus] = useState("");

  const newCodeInputRef = useRef<TextInput>(null);
  const newCodeConfirmInputRef = useRef<TextInput>(null);

  const currentCodeInputAutofocus = useRef(false);
  const newCodeInputAutofocus = useRef(false);
  const newCodeConfirmInputAutofocus = useRef(false);

  const handleOnCurrentCodeChange = (text: string) => {
    setCurrentCode(text);
    setIsTyping(true);
  };

  const handleOnNewCodeChange = (text: string) => {
    setNewCode(text);
    setIsTyping(true);
  };

  const handleOnNewCodeConfirmChange = (text: string) => {
    setNewCodeConfirm(text);
    setIsTyping(true);
  };

  const handleCodeChangeEnabledToggle = () => {
    const isOpen = !codeChangeEnabled;

    if (isOpen) {
      if (!isCurrentCodeValid) {
        currentCodeInputAutofocus.current = true;
      } else if (!isCodeLengthValid(newCode)) {
        newCodeInputAutofocus.current = true;
      } else if (!areCodesMatching(newCode, newCodeConfirm)) {
        newCodeConfirmInputAutofocus.current = true;
      }
    } else {
      currentCodeInputAutofocus.current = false;
      newCodeInputAutofocus.current = false;
      newCodeConfirmInputAutofocus.current = false;
    }

    setCodeChangeEnabled(isOpen);
  };

  const handleOnBiometricsChange = (biometricsEnabled: boolean) => {
    // updateSettingsObject({
    //   lockUseBiometrics: biometricsEnabled,
    // });

    showSnackbar(
      biometricsEnabled
        ? "Biometrics unlock enabled"
        : "Biometrics unlock disabled",
    );
  };

  const handleCurrentCodeEndEditing = async () => {
    // if (isCodeLengthValid(currentCode)) {
    //   if (await isCodeHashValid(currentCode, lockCodeHash)) {
    //     setCurrentCodeStatus("");
    //     setIsCurrentCodeValid(true);
    //   } else {
    //     setCurrentCodeStatus(INVALID_CODE_ERROR_MSG);
    //     setIsCurrentCodeValid(false);
    //   }
    // } else {
    //   setCurrentCodeStatus(INVALID_LENGTH_ERROR_MSG);
    //   setIsCurrentCodeValid(false);
    // }
    // setIsTyping(false);
  };

  const handleNewCodeEndEditing = () => {
    if (isCodeLengthValid(newCode)) {
      setNewCodeStatus("");
      if (areCodesMatching(newCode, newCodeConfirm)) {
        setNewCodeConfirmStatus("");
      } else {
        setNewCodeConfirmStatus(INVALID_CODES_MATCH_ERROR_MSG);
      }
    } else {
      setNewCodeStatus(INVALID_LENGTH_ERROR_MSG);
    }
    setIsTyping(false);
  };

  const handleNewCodeConfirmEndEditing = () => {
    if (!isCodeLengthValid(newCodeConfirm)) {
      setNewCodeConfirmStatus(INVALID_LENGTH_ERROR_MSG);
    } else if (!areCodesMatching(newCode, newCodeConfirm)) {
      setNewCodeConfirmStatus(INVALID_CODES_MATCH_ERROR_MSG);
    } else {
      setNewCodeConfirmStatus("");
    }
    setIsTyping(false);
  };

  const handleOnCurrentCodeSubmit = async () => {
    // if (
    //   (await isCodeHashValid(currentCode, lockCodeHash)) &&
    //   !isCodeLengthValid(newCode)
    // ) {
    //   newCodeInputRef.current?.focus();
    // }
  };

  const handleOnNewCodeSubmit = () => {
    if (
      isCodeLengthValid(newCode) &&
      !areCodesMatching(newCode, newCodeConfirm)
    ) {
      newCodeConfirmInputRef.current?.focus();
    }
  };

  const onConfirmPress = async () => {
    // updateSettingsObject({
    //   lockCodeHash: await getHashFromString(newCode),
    // });

    showSnackbar("Lock was updated");
    router.back();
  };

  const areCodesValid =
    isCurrentCodeValid &&
    isCodeLengthValid(newCode) &&
    areCodesMatching(newCode, newCodeConfirm);

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
                <Appbar.BackAction onPress={router.back} />
              </Appbar.Header>
            ),
            navigationBarColor: theme.colors.background,
          }}
        />
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <Text variant="displaySmall" style={styles.headline}>
            Editing lock
          </Text>
          <Card
            style={styles.newCodeCard}
            onPress={handleCodeChangeEnabledToggle}
          >
            <Card.Content>
              <View style={styles.newCodeCardHeader}>
                <Switch
                  value={codeChangeEnabled}
                  onChange={handleCodeChangeEnabledToggle}
                />
                <Text style={styles.newCodeCardHeaderText} variant="bodyLarge">
                  Change unlock code
                </Text>
              </View>
              {codeChangeEnabled && (
                <View style={styles.newCodeInputsWrapper}>
                  <Text variant="titleMedium">
                    Type current {LOCK_LENGTH}-digit code for unlocking the app
                  </Text>
                  <CodeInput
                    label="Current code"
                    code={currentCode}
                    onCodeChange={handleOnCurrentCodeChange}
                    textInputProps={{
                      autoFocus: currentCodeInputAutofocus.current,
                      style: styles.input,
                      onEndEditing: handleCurrentCodeEndEditing,
                      onSubmitEditing: handleOnCurrentCodeSubmit,
                    }}
                  />
                  <HelperText type="error" visible={currentCodeStatus !== ""}>
                    {currentCodeStatus}
                  </HelperText>
                  <Text variant="titleMedium">
                    Type new {LOCK_LENGTH}-digit code for unlocking the app
                  </Text>
                  <CodeInput
                    label="New code"
                    code={newCode}
                    onCodeChange={handleOnNewCodeChange}
                    textInputProps={{
                      autoFocus: newCodeInputAutofocus.current,
                      ref: newCodeInputRef,
                      style: styles.input,
                      onEndEditing: handleNewCodeEndEditing,
                      onSubmitEditing: handleOnNewCodeSubmit,
                    }}
                  />
                  <HelperText
                    type="error"
                    visible={newCodeStatus !== ""}
                    style={styles.newCodeHelperText}
                  >
                    {newCodeStatus}
                  </HelperText>
                  <Text variant="titleMedium">
                    Type the same {LOCK_LENGTH}-digit code to confirm
                  </Text>
                  <CodeInput
                    label="New code again"
                    code={newCodeConfirm}
                    onCodeChange={handleOnNewCodeConfirmChange}
                    textInputProps={{
                      autoFocus: newCodeConfirmInputAutofocus.current,
                      ref: newCodeConfirmInputRef,
                      style: styles.input,
                      onEndEditing: handleNewCodeConfirmEndEditing,
                    }}
                  />
                  <HelperText
                    type="error"
                    visible={newCodeConfirmStatus !== ""}
                  >
                    {newCodeConfirmStatus}
                  </HelperText>
                  <Button
                    style={styles.confirmButton}
                    mode="contained"
                    disabled={isTyping || !areCodesValid}
                    onPress={onConfirmPress}
                  >
                    Confirm
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
          {/* <UseBiometricsCard
            biometricsEnabled={lockUseBiometrics}
            onChange={handleOnBiometricsChange}
          /> */}
        </ScrollView>
      </View>
    </FlingGesture>
  );
};

export default LockEditScreen;

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
  newCodeCard: {
    marginBottom: spacing.spaceMedium,
  },
  newCodeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  newCodeCardHeaderText: {
    marginStart: spacing.spaceSmall,
  },
  newCodeInputsWrapper: {
    marginTop: spacing.spaceMedium,
  },
  newCodeHelperText: {
    marginBottom: spacing.spaceExtraSmall,
  },
  input: {
    marginTop: spacing.spaceExtraSmall,
  },
  confirmButton: {
    marginTop: spacing.spaceSmall,
  },
});
