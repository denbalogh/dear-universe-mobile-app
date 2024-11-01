import { MD3Theme, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { MD3Type } from "react-native-paper/lib/typescript/types";

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
  sizeLarge: 40,
};

export const roundness = 6;

export const themeLight: MD3Theme = {
  dark: false,
  roundness,
  version: 3,
  isV3: true,
  animation: MD3LightTheme.animation,
  colors: {
    primary: "#236488",
    onPrimary: "#FFFFFF",
    primaryContainer: "#C8E6FF",
    onPrimaryContainer: "#001E2E",
    secondary: "#5F5790",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E5DEFF",
    onSecondaryContainer: "#1B1149",
    tertiary: "#904A41",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFDAD5",
    onTertiaryContainer: "#3B0905",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#F6FAFE",
    onBackground: "#181C20",
    surface: "#FFF8F4",
    onSurface: "#211A14",
    surfaceVariant: "#F2DFD0",
    onSurfaceVariant: "#50453A",
    outline: "#837568",
    outlineVariant: "#D5C3B5",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#372F28",
    inverseOnSurface: "#FDEEE3",
    inversePrimary: "#93CDF6",
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
    primary: "#93CDF6",
    onPrimary: "#00344C",
    primaryContainer: "#004C6D",
    onPrimaryContainer: "#C8E6FF",
    secondary: "#C9BFFF",
    onSecondary: "#31285F",
    secondaryContainer: "#473F77",
    onSecondaryContainer: "#E5DEFF",
    tertiary: "#FFB4A9",
    onTertiary: "#561E17",
    tertiaryContainer: "#73342B",
    onTertiaryContainer: "#FFDAD5",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#101417",
    onBackground: "#DFE3E7",
    surface: "#19120C",
    onSurface: "#EEE0D5",
    surfaceVariant: "#50453A",
    onSurfaceVariant: "#D5C3B5",
    outline: "#9D8E81",
    outlineVariant: "#50453A",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#EEE0D5",
    inverseOnSurface: "#372F28",
    inversePrimary: "#236488",
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
  },
  fonts,
};
