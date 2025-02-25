import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import logCrashlytics from "@/utils/logCrashlytics";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  TestIds,
} from "react-native-google-mobile-ads";
import StarRating from "./StarRating";
import { Text as PaperText } from "react-native-paper";
import { AD_ID } from "@/constants/ads";
import { EXPO_CONFIG_EXTRA } from "@/constants/expoConfig";

export const ICON_SIZE = 60;

type Props = ViewProps;

const NativeAdBannerSlim = ({ style, ...viewProps }: Props) => {
  const theme = useCustomTheme();
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    logCrashlytics("Creating native ad for banner slim");
    NativeAd.createForAdRequest(
      EXPO_CONFIG_EXTRA.adsTest ? TestIds.NATIVE : AD_ID,
      {
        aspectRatio: NativeMediaAspectRatio.SQUARE,
      },
    ).then(setNativeAd);
  }, []);

  useEffect(() => {
    if (!nativeAd) return;
    return () => {
      nativeAd.destroy();
    };
  }, [nativeAd]);

  if (!nativeAd || EXPO_CONFIG_EXTRA.hideAds) {
    return null;
  }

  return (
    <View
      style={[
        style,
        styles.wrapper,
        {
          borderColor: theme.colors.onBackground,
          backgroundColor: theme.colors.background,
        },
      ]}
      {...viewProps}
    >
      <NativeAdView nativeAd={nativeAd} style={styles.nativeAdView}>
        {nativeAd.icon && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        )}
        <View style={styles.rightWrapper}>
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
          <View style={styles.adLabelRatingWrapper}>
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
            {nativeAd.starRating && (
              <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                <View>
                  <StarRating
                    rating={nativeAd.starRating}
                    style={styles.starRating}
                  />
                </View>
              </NativeAsset>
            )}
          </View>
        </View>
      </NativeAdView>
    </View>
  );
};

export default NativeAdBannerSlim;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    padding: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
  nativeAdView: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginEnd: spacing.spaceSmall,
  },
  rightWrapper: {
    flex: 1,
  },
  adLabelRatingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.spaceExtraSmall,
  },
  adLabelWrapper: {
    paddingHorizontal: spacing.spaceExtraSmall,
    borderWidth: 1,
    borderRadius: roundness,
  },
  starRating: {
    marginStart: spacing.spaceSmall,
  },
});
