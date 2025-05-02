import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
};

const Feelings = ({ feelingsGroup, feelingsEmotions }: Props) => {
  const theme = useCustomTheme();
  const hasFeelings = feelingsEmotions.length > 0;

  return (
    <View style={styles.emotionsWrapper}>
      {(hasFeelings ? feelingsEmotions : [feelingsGroup]).map(
        (emotion, index) => (
          <Text
            key={`${emotion}-${index}`}
            style={[
              styles.emotion,
              {
                backgroundColor: theme.colors[`${feelingsGroup}Container`],
              },
            ]}
          >
            {emotion}
          </Text>
        ),
      )}
    </View>
  );
};

export default Feelings;

const styles = StyleSheet.create({
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  emotion: {
    marginRight: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
    padding: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
});
