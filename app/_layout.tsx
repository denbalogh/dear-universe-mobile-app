import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </PaperProvider>
  );
}
