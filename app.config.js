module.exports = {
  expo: {
    name: "Dear universe",
    slug: "dear-universe-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    ios: {
      bundleIdentifier: "com.denbalogh.dearuniverseapp",
      requireFullScreen: true,
      supportsTablet: false,
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "The app needs access to your microphone in order to record audio for your entry.",
      },
    },
    android: {
      package: "com.denbalogh.dearuniverseapp",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Nunito/Nunito-Regular.ttf",
            "./assets/fonts/PT_Sans/PTSans-Regular.ttf",
          ],
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app needs access to your media library in order to add photos to your entry.",
          cameraPermission:
            "The app needs access to your camera in order to take photos for your entry.",
        },
      ],
      [
        "expo-screen-orientation",
        {
          initialOrientation: "PORTRAIT",
        },
      ],
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/images/splash.png",
          dark: {
            image: "./assets/images/splash.png",
            backgroundColor: "#ffffff",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "179716c1-8891-4d76-8d1f-1e24dfb89a6d",
      },
      storybookEnabled: process.env.STORYBOOK_ENABLED,
    },
    owner: "denbalogh",
    newArchEnabled: true,
  },
};
