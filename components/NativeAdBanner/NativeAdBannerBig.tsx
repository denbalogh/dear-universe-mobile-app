import { spacing } from "@/constants/theme";
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
import StarRating from "./StarCount";
import { getColorWithOpacity } from "@/utils/style";

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
    <NativeAdView
      {...viewProps}
      style={[
        style,
        styles.wrapper,
        {
          backgroundColor: getColorWithOpacity(theme.colors.background, 0.8),
        },
      ]}
      nativeAd={nativeAd}
    >
      <NativeMediaView style={styles.banner} />
      <View style={[styles.textWrapper]}>
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
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            style={[
              theme.fonts.bodySmall,
              { color: theme.colors.onBackground },
            ]}
          >
            {nativeAd.body}
          </Text>
        </NativeAsset>
        {nativeAd.starRating && (
          <NativeAsset assetType={NativeAssetType.STAR_RATING}>
            <View>
              <StarRating rating={nativeAd.starRating} />
            </View>
          </NativeAsset>
        )}
      </View>
    </NativeAdView>
  );
};

export default NativeAdBannerBig;

const styles = StyleSheet.create({
  wrapper: {
    margin: spacing.spaceMedium,
    paddingTop: spacing.spaceSmall,
  },
  banner: {
    marginHorizontal: spacing.spaceSmall,
  },
  textWrapper: {
    padding: spacing.spaceSmall,
  },
});
