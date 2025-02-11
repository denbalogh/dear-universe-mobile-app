import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { Appbar, Portal } from "react-native-paper";
import NavigationAwareModal from "../NavigationAwareModal/NavigationAwareModal";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import WebView from "react-native-webview";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  url: string;
};

const WebViewModal = ({ isVisible, onClose, url }: Props) => {
  const theme = useCustomTheme();
  const { statusBarStyle } = useActiveColorScheme();

  return (
    <Portal>
      <NavigationAwareModal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.wrapper,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <StatusBar
          backgroundColor={theme.colors.background}
          style={statusBarStyle}
        />
        <Appbar.Header
          style={{ backgroundColor: theme.colors.background }}
          statusBarHeight={0}
        >
          <Appbar.Action icon="close" onPress={onClose} />
        </Appbar.Header>
        <WebView source={{ uri: url }} style={styles.webView} />
      </NavigationAwareModal>
    </Portal>
  );
};

export default WebViewModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
