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
      googleServicesFile: "./GoogleService-Info.plist",
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
      googleServicesFile: "./google-services.json",
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
          androidAppId: "ca-app-pub-3470994410920852~8621670596",
          iosAppId: "ca-app-pub-3470994410920852~4803018548",
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
            "The app needs access to your media library in order to add photos to your entry.",
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
        projectId: "179716c1-8891-4d76-8d1f-1e24dfb89a6d",
      },
      storybookEnabled: process.env.STORYBOOK_ENABLED,
    },
    owner: "denbalogh",
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/179716c1-8891-4d76-8d1f-1e24dfb89a6d",
    },
    runtimeVersion: "1.0.0",
  },
};
