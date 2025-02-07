import logCrashlytics from "@/utils/logCrashlytics";
import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
} from "expo-screen-orientation";
import { useEffect, useMemo, useState } from "react";

export type CustomOrientation = "portrait" | "landscape";

const useScreenOrientation = (): CustomOrientation => {
  const [orientation, setOrientation] = useState(Orientation.PORTRAIT_UP);

  useEffect(() => {
    logCrashlytics("Screen orientation - get initial orientation");
    // set initial orientation
    getOrientationAsync().then((info) => {
      setOrientation(info);
    });

    logCrashlytics("Screen orientation - add listener");
    // subscribe to future changes
    const subscription = addOrientationChangeListener(
      ({ orientationInfo: { orientation } }) => {
        setOrientation(orientation);
      },
    );

    // return a clean up function to unsubscribe from notifications
    return () => {
      logCrashlytics("Screen orientation - remove listener");
      removeOrientationChangeListener(subscription);
    };
  }, []);

  return useMemo(() => {
    if (
      orientation === Orientation.LANDSCAPE_LEFT ||
      orientation === Orientation.LANDSCAPE_RIGHT
    ) {
      return "landscape";
    } else {
      return "portrait";
    }
  }, [orientation]);
};

export default useScreenOrientation;
