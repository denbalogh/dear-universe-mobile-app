import FlingGesture from "@/common/components/FlingGesture";
import {
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from "@/common/constants/settings";
import { spacing } from "@/common/constants/theme";
import useBackHandler from "@/common/hooks/useBackHandler";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { Appbar, Button, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebViewModal from "@/common/components/WebViewModal";
import { useSettings } from "@/common/providers/SettingsProvider";
import database from "@/common/models/db";

const TermsScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const settings = useSettings();
  const { termsUnderstood } = settings;

  const [url, setUrl] = useState<string>("");

  const openWebViewModal = (url: string) => {
    setUrl(url);
  };

  const closeWebViewModal = () => {
    setUrl("");
  };

  const onConfirmPress = async () => {
    await database.write(async () => {
      await settings.update((s) => {
        s.termsUnderstood = true;
      });
    });
    router.back();
  };

  const onAndroidBackButtonPress = useCallback(() => {
    if (!termsUnderstood) {
      BackHandler.exitApp();
      return true;
    }
    return false;
  }, [termsUnderstood]);

  useBackHandler(onAndroidBackButtonPress);

  const onFlingDown = () => {
    if (termsUnderstood) {
      router.back();
    }
  };

  return (
    <FlingGesture onFlingDown={onFlingDown}>
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
                {termsUnderstood && <Appbar.BackAction onPress={router.back} />}
              </Appbar.Header>
            ),
            navigationBarColor: theme.colors.background,
          }}
        />
        <View style={styles.content}>
          <Text variant="displaySmall">Terms & Policies</Text>
          <View>
            <Button
              mode="elevated"
              style={styles.linkButton}
              onPress={() => openWebViewModal(TERMS_AND_CONDITIONS_URL)}
            >
              TERMS & CONDITIONS
            </Button>
            <Button
              mode="elevated"
              style={styles.linkButton}
              onPress={() => openWebViewModal(PRIVACY_POLICY_URL)}
            >
              PRIVACY POLICY
            </Button>
            <Text style={styles.text}>
              By using this app you agree to the TERMS & CONDITIONS and PRIVACY
              POLICY. Please review them carefully before continuing.
            </Text>
          </View>
          <View>
            {!termsUnderstood && (
              <Button
                mode="contained"
                style={styles.confirmButton}
                onPress={onConfirmPress}
              >
                I understand
              </Button>
            )}
          </View>
        </View>
        <WebViewModal
          url={url}
          isVisible={url !== ""}
          onClose={closeWebViewModal}
        />
      </View>
    </FlingGesture>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.spaceMedium,
    justifyContent: "space-between",
  },
  text: {
    marginVertical: spacing.spaceMedium,
  },
  linkButton: {
    marginVertical: spacing.spaceSmall,
  },
  confirmButton: {
    marginTop: spacing.spaceLarge,
  },
});
