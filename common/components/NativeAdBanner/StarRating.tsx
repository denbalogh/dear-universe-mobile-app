import { sizing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React, { ComponentProps, memo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Icon } from "react-native-paper";

type StarIconProps = {
  icon: ComponentProps<typeof Icon>["source"];
};

const StarIcon = ({ icon }: StarIconProps) => {
  const theme = useCustomTheme();

  return (
    <Icon
      source={icon}
      size={sizing.sizeExtraSmall}
      color={theme.colors.secondary}
    />
  );
};

type Props = {
  rating: number; // Number of stars from 0 to 5, with 0.5 increments
} & ViewProps;

const StarRating = memo(({ rating, style, ...viewProps }: Props) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={[styles.wrapper, style]} {...viewProps}>
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={`full-${index}`} icon="star" />
      ))}
      {hasHalfStar && <StarIcon key="half" icon="star-half-full" />}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon key={`empty-${index}`} icon="star-outline" />
      ))}
    </View>
  );
});

StarRating.displayName = "StarRating";

export default StarRating;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});
