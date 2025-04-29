const GOOGLE_ADS_ANDROID_APP_ID = "ca-app-pub-3470994410920852~8621670596";
const GOOGLE_ADS_IOS_APP_ID = "ca-app-pub-3470994410920852~4803018548";

module.exports = {
  expo: {
    name: "Dear Universe",
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
      infoPlist: {
        NSMicrophoneUsageDescription:
          "The app needs access to your microphone in order to record audio for your entry.",
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      package: "com.denbalogh.dearuniverseapp",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FDF8FF",
      },
      permissions: [
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.RECEIVE_BOOT_COMPLETED",
      ],
    },
    plugins: [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: GOOGLE_ADS_ANDROID_APP_ID,
          iosAppId: GOOGLE_ADS_IOS_APP_ID,
          delayAppMeasurementInit: true,
        },
      ],
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission:
            "This identifier will be used to deliver personalized ads to you.",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            extraPods: [
              {
                name: "simdjson",
                configurations: ["Debug", "Release"],
                path: "../node_modules/@nozbe/simdjson",
                modular_headers: true,
              },
            ],
          },
          android: {
            extraProguardRules:
              "-keep class com.google.android.gms.internal.consent_sdk.** { *; }",
            kotlinVersion: "1.9.25",
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
            "The app needs access to your media library in order to add photos/videos to your entry.",
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
          backgroundColor: "#FDF8FF",
          image: "./assets/images/splash-light.png",
          dark: {
            image: "./assets/images/splash-dark.png",
            backgroundColor: "#141318",
          },
          imageWidth: 100,
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission:
            "The app needs access to FaceID in order to authenticate you.",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/notification-icon.png",
          color: "#ffffff",
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
      GOOGLE_ADS_ANDROID_APP_ID: GOOGLE_ADS_ANDROID_APP_ID,
      GOOGLE_ADS_IOS_APP_ID: GOOGLE_ADS_IOS_APP_ID,
    },
    owner: "denbalogh",
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/179716c1-8891-4d76-8d1f-1e24dfb89a6d",
    },
    runtimeVersion: "1.0.0",
  },
};
