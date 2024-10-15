import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Constants from "expo-constants";
import Storybook from "../.storybook";

// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

const App = () => (
  <PaperProvider>
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  </PaperProvider>
);

let AppEntryPoint = App;

if (Constants?.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = Storybook;
}

export default AppEntryPoint;
