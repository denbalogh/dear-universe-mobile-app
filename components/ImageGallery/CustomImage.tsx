import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Image, ImageProps } from "expo-image";
import {
  ActivityIndicator,
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from "react-native-paper";

export type CustomImageProps = {
  imageProps: ImageProps;
  loadingStyle?: ViewProps["style"];
  touchableProps?: Omit<TouchableRippleProps, "children" | "style">;
  isLoadingTest?: boolean;
} & ViewProps;

const CustomImage = ({
  imageProps,
  loadingStyle = {},
  touchableProps,
  isLoadingTest, // This prop is only used for testing purposes
  ...props
}: CustomImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const isLoadingFinal = isLoadingTest ?? isLoading;

  return (
    <View {...props}>
      <Image
        {...imageProps}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        style={[imageProps.style, styles.fullsize]}
      />
      {isLoadingFinal && (
        <View
          style={[
            loadingStyle,
            styles.loadingWrapper,
            styles.fullsize,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          accessibilityLabel="Loading image"
        >
          <ActivityIndicator />
        </View>
      )}
      {touchableProps && (
        <TouchableRipple
          {...touchableProps}
          style={[styles.touchable, styles.fullsize]}
          testID="TouchableImage"
          disabled={touchableProps.disabled || isLoadingFinal}
        >
          <View style={styles.fullsize} />
        </TouchableRipple>
      )}
    </View>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  loadingWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  touchable: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  fullsize: {
    width: "100%",
    height: "100%",
  },
});
