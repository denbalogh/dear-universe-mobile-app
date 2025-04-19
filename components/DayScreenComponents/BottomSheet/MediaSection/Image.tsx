import React, { memo, useCallback, useMemo } from "react";
import { Image as ExpoImage } from "expo-image";
import { Checkbox, Icon, TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/utils/style";
import { StyleSheet } from "react-native";
import { roundness, sizing, spacing } from "@/constants/theme";
import { Media } from "@/types/Media";
import { useEntryDraft } from "@/contexts/EntryDraftContext";

type Props = {
  item: Media;
  index: number;
  size: number;
  onPress: (index: number) => void;
};

const Image = ({ item, size, index, onPress }: Props) => {
  const theme = useCustomTheme();
  const backgroundColor = getColorWithOpacity(theme.colors.background, 0.6);

  const { media, setMedia } = useEntryDraft();

  const handleOnPress = useCallback(() => onPress(index), [onPress, index]);

  const handleOnCheck = useCallback(() => {
    if (media.some(({ uri }) => item.uri === uri)) {
      setMedia(media.filter(({ uri }) => item.uri !== uri));
    } else {
      setMedia([...media, item]);
    }
  }, [item, media, setMedia]);

  const isChecked = useMemo(() => {
    return media.some(({ uri }) => item.uri === uri);
  }, [item, media]);

  return (
    <TouchableRipple
      onPress={handleOnPress}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <>
        <ExpoImage
          style={{ width: size, height: size }}
          source={{ uri: item.uri }}
        />
        <View style={[styles.check, { backgroundColor }]}>
          <Checkbox
            status={isChecked ? "checked" : "unchecked"}
            onPress={handleOnCheck}
            color={theme.colors.onBackground}
          />
        </View>
        {item.mediaType === "video" && (
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
