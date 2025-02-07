import { getApp } from "@react-native-firebase/app";
import { log } from "@react-native-firebase/crashlytics";

export default function logCrashlytics(message: string) {
  log(getApp().crashlytics(), message);
}
