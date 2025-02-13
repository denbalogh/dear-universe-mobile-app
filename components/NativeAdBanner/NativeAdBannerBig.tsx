import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import logCrashlytics from "@/utils/logCrashlytics";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";
import StarRating from "./StarRating";
import { Text as PaperText } from "react-native-paper";
import { Image } from "expo-image";
import { ICON_SIZE } from "./NativeAdBannerSlim";

type Props = ViewProps;

const NativeAdBannerBig = ({ style, ...viewProps }: Props) => {
  const theme = useCustomTheme();
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    logCrashlytics("Creating native ad for banner big");
    NativeAd.createForAdRequest(TestIds.NATIVE, {
      aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
    }).then(setNativeAd);
  }, []);

  useEffect(() => {
    if (!nativeAd) return;
    return () => {
      nativeAd.destroy();
    };
  }, [nativeAd]);

  if (!nativeAd) {
    return null;
  }

  return (
    <View
      {...viewProps}
      style={[
        style,
        styles.wrapper,
        { borderColor: theme.colors.onBackground },
      ]}
    >
      <NativeAdView nativeAd={nativeAd}>
        <NativeMediaView />
        <View style={styles.iconTitleRatingWrapper}>
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
            </NativeAsset>
          )}
          <View style={styles.titleRatingWrapper}>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text
                style={[
                  theme.fonts.titleMedium,
                  { color: theme.colors.onBackground },
                ]}
              >
                {nativeAd.headline}
              </Text>
            </NativeAsset>
            {nativeAd.starRating && (
              <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                <StarRating rating={nativeAd.starRating} />
              </NativeAsset>
            )}
          </View>
        </View>
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            style={[
              theme.fonts.bodyMedium,
              { color: theme.colors.onBackground },
            ]}
          >
            {nativeAd.body}
          </Text>
        </NativeAsset>
        <View
          style={[
            styles.adLabelWrapper,
            {
              borderColor: theme.colors.onBackground,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <PaperText variant="labelLarge">Ad</PaperText>
        </View>
      </NativeAdView>
    </View>
  );
};

export default NativeAdBannerBig;

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.spaceSmall,
    borderWidth: 1,
    borderRadius: roundness,
  },
  iconTitleRatingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.spaceSmall,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginEnd: spacing.spaceSmall,
  },
  titleRatingWrapper: {
    flex: 1,
  },
  adLabelWrapper: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
    paddingHorizontal: spacing.spaceExtraSmall,
    borderWidth: 1,
    borderRadius: roundness,
  },
});
