import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Text } from "react-native-paper";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";

type Props = {
  superHeadline: string;
  headline: string;
  headlineVariant?: VariantProp<unknown>;
} & ViewProps;

const SectionHeadline = ({
  headline,
  superHeadline,
  headlineVariant = "headlineLarge",
  ...viewProps
}: Props) => {
  const theme = useCustomTheme();

  return (
    <View
      {...viewProps}
      style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}
    >
      <Text variant="titleMedium">{superHeadline}</Text>
      <Text variant={headlineVariant}>{headline}</Text>
    </View>
  );
};

export default SectionHeadline;

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.spaceMedium,
    paddingVertical: spacing.spaceSmall,
  },
});
