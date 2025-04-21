import "dotenv/config";

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
      googleServicesFile:
        process.env.GOOGLE_SERVICES_IOS ?? "./GoogleService-Info.plist",
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
      googleServicesFile:
        process.env.GOOGLE_SERVICES_ANDROID ?? "./google-services.json",
      permissions: [
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.RECEIVE_BOOT_COMPLETED",
      ],
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/crashlytics",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: process.env.GOOGLE_ADS_ANDROID_APP_ID,
          iosAppId: process.env.GOOGLE_ADS_IOS_APP_ID,
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
          },
          android: {
            extraProguardRules:
              "-keep class com.google.android.gms.internal.consent_sdk.** { *; }",
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
        "expo-camera",
        {
          cameraPermission:
            "The app needs access to your camera in order to take photos/videos for your entry.",
          microphonePermission:
            "The app needs access to your microphone in order to record audio in the videos.",
          recordAudioAndroid: true,
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
        projectId: process.env.EAS_PROJECT_ID,
      },
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      hideAds: process.env.HIDE_ADS,
      adsTest: process.env.ADS_TEST,
    },
    owner: "denbalogh",
    newArchEnabled: true,
    updates: {
      url: process.env.EAS_UPDATES_URL,
    },
    runtimeVersion: "1.0.0",
  },
};
