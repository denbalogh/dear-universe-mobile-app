import { spacing } from "@/constants/theme";
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
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";
import StarRating from "./StarCount";

const imageSize = 60;

type Props = ViewProps;

const NativeAdBannerSlim = ({ style, ...viewProps }: Props) => {
  const theme = useCustomTheme();
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    logCrashlytics("Creating native ad for banner slim");
    NativeAd.createForAdRequest(TestIds.NATIVE, {
      aspectRatio: NativeMediaAspectRatio.SQUARE,
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
      style={[style, styles.wrapper]}
      nativeAd={nativeAd}
    >
      {nativeAd.icon ? (
        <NativeAsset assetType={NativeAssetType.ICON}>
          <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
        </NativeAsset>
      ) : (
        <NativeMediaView style={styles.banner} />
      )}
      <View style={styles.textWrapper}>
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

export default NativeAdBannerSlim;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: imageSize,
    height: imageSize,
  },
  banner: {
    height: imageSize,
  },
  textWrapper: {
    marginStart: spacing.spaceSmall,
  },
});
