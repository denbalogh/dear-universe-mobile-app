import React, { memo, useCallback } from "react";
import { Image as ExpoImage } from "expo-image";
import { Checkbox, Icon, TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/utils/style";
import { StyleSheet } from "react-native";
import { roundness, sizing, spacing } from "@/constants/theme";

type Props = {
  uri: string;
  index: number;
  size: number;
  isChecked: boolean;
  onPress: (index: number) => void;
  onCheck: (index: number) => void;
  isVideo: boolean;
};

const Image = ({
  uri,
  size,
  index,
  isChecked,
  onPress,
  onCheck,
  isVideo,
}: Props) => {
  const theme = useCustomTheme();
  const backgroundColor = getColorWithOpacity(theme.colors.background, 0.6);

  const handleOnPress = useCallback(() => onPress(index), [onPress, index]);
  const handleOnCheck = useCallback(() => onCheck(index), [onCheck, index]);

  return (
    <TouchableRipple
      onPress={handleOnPress}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <>
        <ExpoImage style={{ width: size, height: size }} source={{ uri }} />
        <View style={[styles.check, { backgroundColor }]}>
          <Checkbox
            status={isChecked ? "checked" : "unchecked"}
            onPress={handleOnCheck}
            color={theme.colors.onBackground}
          />
        </View>
        {isVideo && (
          <View style={[StyleSheet.absoluteFill, styles.playIconWrapper]}>
            <View style={[styles.playIcon, { backgroundColor }]}>
              <Icon
                source="play"
                size={sizing.sizeMedium}
                color={theme.colors.onBackground}
              />
            </View>
          </View>
        )}
      </>
    </TouchableRipple>
  );
};

export default memo(Image);

const styles = StyleSheet.create({
  playIconWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  playIcon: {
    borderRadius: roundness,
    margin: spacing.spaceSmall,
  },
  check: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
