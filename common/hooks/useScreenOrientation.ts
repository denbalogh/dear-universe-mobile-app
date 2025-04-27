import {
  addOrientationChangeListener,
  getOrientationAsync,
  Orientation,
  removeOrientationChangeListener,
} from "expo-screen-orientation";
import { useEffect, useState } from "react";

const useScreenOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState(Orientation.PORTRAIT_UP);

  useEffect(() => {
    // set initial orientation
    getOrientationAsync().then((info) => {
      setOrientation(info);
    });

    // subscribe to future changes
    const subscription = addOrientationChangeListener(
      ({ orientationInfo: { orientation } }) => {
        setOrientation(orientation);
      },
    );

    // return a clean up function to unsubscribe from notifications
    return () => {
      removeOrientationChangeListener(subscription);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
