import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const TextTesting = () => {
  return (
    <View>
      <Text style={styles.text} variant="displayLarge">
        Display Large
      </Text>
      <Text style={styles.text} variant="displayMedium">
        Display Medium
      </Text>
      <Text style={styles.text} variant="displaySmall">
        Display Small
      </Text>
      <Text style={styles.text} variant="headlineLarge">
        Headline Large
      </Text>
      <Text style={styles.text} variant="headlineMedium">
        Headline Medium
      </Text>
      <Text style={styles.text} variant="headlineSmall">
        Headline Small
      </Text>
      <Text style={styles.text} variant="bodyLarge">
        Body Large
      </Text>
      <Text style={styles.text} variant="bodyMedium">
        Body Medium
      </Text>
      <Text style={styles.text} variant="bodySmall">
        Body Small
      </Text>
      <Text style={styles.text} variant="titleLarge">
        Title Large
      </Text>
      <Text style={styles.text} variant="titleMedium">
        Title Medium
      </Text>
      <Text style={styles.text} variant="titleSmall">
        Title Small
      </Text>
      <Text style={styles.text} variant="labelLarge">
        Label Large
      </Text>
      <Text style={styles.text} variant="labelMedium">
        Label Medium
      </Text>
      <Text style={styles.text} variant="labelSmall">
        Label Small
      </Text>
    </View>
  );
};

export default TextTesting;

const styles = StyleSheet.create({
  text: {
    marginVertical: spacing.spaceMedium,
    backgroundColor: "red",
  },
});
