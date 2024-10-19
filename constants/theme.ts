import { MD3Theme, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { MD3Type } from "react-native-paper/lib/typescript/types";

const headersTypeRegular: MD3Type = {
  fontFamily: "AlegreyaSansSC-Regular",
  letterSpacing: 0,
  fontWeight: "normal",
  fontSize: 57,
  lineHeight: 64,
};

const bodyTypeRegular: MD3Type = {
  fontFamily: "BalooPaaji2-Regular",
  letterSpacing: 0,
  fontWeight: "normal",
  fontSize: 24,
  lineHeight: 32,
};

const fonts: MD3Theme["fonts"] = {
  displayLarge: {
    ...headersTypeRegular,
    fontSize: 57,
    lineHeight: 64,
  },
  displayMedium: {
    ...headersTypeRegular,
    fontSize: 45,
    lineHeight: 52,
  },
  displaySmall: {
    ...headersTypeRegular,
    fontSize: 36,
    lineHeight: 44,
  },
  headlineLarge: {
    ...headersTypeRegular,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineMedium: {
    ...headersTypeRegular,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineSmall: {
    ...headersTypeRegular,
    fontSize: 24,
    lineHeight: 32,
  },
  bodyLarge: {
    ...bodyTypeRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    ...bodyTypeRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    ...bodyTypeRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  labelLarge: {
    ...bodyTypeRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  labelMedium: {
    ...bodyTypeRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  labelSmall: {
    ...bodyTypeRegular,
    fontSize: 11,
    lineHeight: 16,
  },
  titleLarge: {
    ...bodyTypeRegular,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMedium: {
    ...bodyTypeRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  titleSmall: {
    ...bodyTypeRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontFamily: "BalooPaaji2-Regular",
    letterSpacing: 0,
    fontWeight: "normal",
  },
};

export const spacing = {
  spaceExtraSmall: 5,
  spaceSmall: 10,
  spaceMedium: 20,
  spaceLarge: 40,
};

export const sizing = {
  sizeSmall: 16,
  sizeMedium: 24,
};

export const roundness = 6;

export const themeLight: MD3Theme = {
  dark: false,
  roundness,
  version: 3,
  isV3: true,
  animation: MD3LightTheme.animation,
  colors: {
    primary: "rgb(63, 90, 169)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(219, 225, 255)",
    onPrimaryContainer: "rgb(0, 23, 77)",
    secondary: "rgb(62, 90, 169)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(219, 225, 255)",
    onSecondaryContainer: "rgb(0, 23, 75)",
    tertiary: "rgb(156, 66, 58)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 218, 214)",
    onTertiaryContainer: "rgb(65, 0, 2)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(254, 251, 255)",
    onBackground: "rgb(27, 27, 31)",
    surface: "rgb(254, 251, 255)",
    onSurface: "rgb(27, 27, 31)",
    surfaceVariant: "rgb(226, 225, 236)",
    onSurfaceVariant: "rgb(69, 70, 79)",
    outline: "rgb(118, 118, 128)",
    outlineVariant: "rgb(198, 198, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 52)",
    inverseOnSurface: "rgb(242, 240, 244)",
    inversePrimary: "rgb(181, 196, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(244, 243, 251)",
      level2: "rgb(239, 238, 248)",
      level3: "rgb(233, 233, 246)",
      level4: "rgb(231, 232, 245)",
      level5: "rgb(227, 229, 243)",
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)",
  },
  fonts,
};

export const themeDark: MD3Theme = {
  dark: true,
  roundness,
  version: 3,
  isV3: true,
  animation: MD3DarkTheme.animation,
  colors: {
    primary: "rgb(181, 196, 255)",
    onPrimary: "rgb(3, 41, 120)",
    primaryContainer: "rgb(37, 66, 144)",
    onPrimaryContainer: "rgb(219, 225, 255)",
    secondary: "rgb(180, 197, 255)",
    onSecondary: "rgb(0, 42, 119)",
    secondaryContainer: "rgb(35, 66, 144)",
    onSecondaryContainer: "rgb(219, 225, 255)",
    tertiary: "rgb(255, 180, 171)",
    onTertiary: "rgb(95, 20, 17)",
    tertiaryContainer: "rgb(125, 43, 36)",
    onTertiaryContainer: "rgb(255, 218, 214)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 31)",
    onBackground: "rgb(228, 226, 230)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(228, 226, 230)",
    surfaceVariant: "rgb(69, 70, 79)",
    onSurfaceVariant: "rgb(198, 198, 208)",
    outline: "rgb(143, 144, 154)",
    outlineVariant: "rgb(69, 70, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 226, 230)",
    inverseOnSurface: "rgb(48, 48, 52)",
    inversePrimary: "rgb(63, 90, 169)",
    elevation: {
      level0: "transparent",
      level1: "rgb(35, 35, 42)",
      level2: "rgb(39, 41, 49)",
      level3: "rgb(44, 46, 56)",
      level4: "rgb(46, 47, 58)",
      level5: "rgb(49, 51, 62)",
    },
    surfaceDisabled: "rgba(228, 226, 230, 0.12)",
    onSurfaceDisabled: "rgba(228, 226, 230, 0.38)",
    backdrop: "rgba(47, 48, 56, 0.4)",
  },
  fonts,
};
