import { MD3Theme, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { MD3Colors, MD3Type } from "react-native-paper/lib/typescript/types";
import {
  FeelingColors,
  feelingColorsDark,
  feelingColorsLight,
} from "./feelings";

const headersTypeRegular: MD3Type = {
  fontFamily: "Nunito-Regular",
  letterSpacing: 0,
  fontWeight: "normal",
  fontSize: 57,
  lineHeight: 64,
};

const bodyTypeRegular: MD3Type = {
  fontFamily: "PTSans-Regular",
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
    fontFamily: "PTSans-Regular",
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
  sizeExtraSmall: 12,
  sizeSmall: 16,
  sizeMedium: 24,
  sizeLarge: 40,
};

export const roundness = 6;

export type CustomTheme = MD3Theme & {
  colors: MD3Colors & FeelingColors;
};

export const themeLight: CustomTheme = {
  dark: false,
  roundness,
  version: 3,
  isV3: true,
  animation: MD3LightTheme.animation,
  colors: {
    primary: "#5F5791",
    onPrimary: "#FFFFFF",
    primaryContainer: "#E5DEFF",
    onPrimaryContainer: "#1B1149",
    secondary: "#236488",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#C8E6FF",
    onSecondaryContainer: "#001E2E",
    tertiary: "#904A41",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFDAD5",
    onTertiaryContainer: "#3B0906",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#FDF8FF",
    onBackground: "#1C1B20",
    surface: "#FFF8F5",
    onSurface: "#211A14",
    surfaceVariant: "#EFE0CF",
    onSurfaceVariant: "#4F4539",
    outline: "#817567",
    outlineVariant: "#D3C4B4",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#372F28",
    inverseOnSurface: "#FDEEE3",
    inversePrimary: "#C8BFFF",
    elevation: {
      level0: "transparent",
      level1: "rgb(239, 244, 249)",
      level2: "rgb(232, 240, 246)",
      level3: "rgb(224, 235, 243)",
      level4: "rgb(222, 234, 242)",
      level5: "rgb(217, 231, 239)",
    },
    surfaceDisabled: "rgba(25, 28, 30, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 30, 0.38)",
    backdrop: "rgba(43, 49, 54, 0.4)",
    ...feelingColorsLight,
  },
  fonts,
};

export const themeDark: CustomTheme = {
  dark: true,
  roundness,
  version: 3,
  isV3: true,
  animation: MD3DarkTheme.animation,
  colors: {
    primary: "#C8BFFF",
    onPrimary: "#30285F",
    primaryContainer: "#473F77",
    onPrimaryContainer: "#E5DEFF",
    secondary: "#93CDF6",
    onSecondary: "#00344C",
    secondaryContainer: "#004C6D",
    onSecondaryContainer: "#C8E6FF",
    tertiary: "#FFB4A9",
    onTertiary: "#561E18",
    tertiaryContainer: "#73342C",
    onTertiaryContainer: "#FFDAD5",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#141318",
    onBackground: "#E5E1E9",
    surface: "#19120C",
    onSurface: "#EFE0D5",
    surfaceVariant: "#4F4539",
    onSurfaceVariant: "#D3C4B4",
    outline: "#9B8F80",
    outlineVariant: "#4F4539",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#EFE0D5",
    inverseOnSurface: "#372F28",
    inversePrimary: "#5F5791",
    elevation: {
      level0: "transparent",
      level1: "rgb(30, 37, 41)",
      level2: "rgb(34, 42, 48)",
      level3: "rgb(37, 48, 55)",
      level4: "rgb(38, 49, 57)",
      level5: "rgb(40, 53, 62)",
    },
    surfaceDisabled: "rgba(226, 226, 229, 0.12)",
    onSurfaceDisabled: "rgba(226, 226, 229, 0.38)",
    backdrop: "rgba(43, 49, 54, 0.4)",
    ...feelingColorsDark,
  },
  fonts,
};
