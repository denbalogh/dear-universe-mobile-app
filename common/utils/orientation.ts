import { Orientation, OrientationLock } from "expo-screen-orientation";

export const isPortrait = (orientation: Orientation) => {
  return (
    orientation === Orientation.PORTRAIT_UP ||
    orientation === Orientation.PORTRAIT_DOWN
  );
};

export const isLandscape = (orientation: Orientation) => {
  return (
    orientation === Orientation.LANDSCAPE_LEFT ||
    orientation === Orientation.LANDSCAPE_RIGHT
  );
};

export const getOrientationLock = (
  orientation: Orientation,
): OrientationLock => {
  switch (orientation) {
    case Orientation.PORTRAIT_UP:
      return OrientationLock.PORTRAIT_UP;
    case Orientation.PORTRAIT_DOWN:
      return OrientationLock.PORTRAIT_DOWN;
    case Orientation.LANDSCAPE_LEFT:
      return OrientationLock.LANDSCAPE_LEFT;
    case Orientation.LANDSCAPE_RIGHT:
      return OrientationLock.LANDSCAPE_RIGHT;
    default:
      return OrientationLock.DEFAULT;
  }
};
