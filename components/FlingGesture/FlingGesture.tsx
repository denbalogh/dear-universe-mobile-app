import React, { ReactNode, useMemo } from "react";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

type Props = {
  onFlingLeft?: () => void;
  onFlingRight?: () => void;
  onFlingDown?: () => void;
  children: ReactNode;
};

const FlingGesture = ({
  onFlingLeft = () => {},
  onFlingRight = () => {},
  onFlingDown = () => {},
  children,
}: Props) => {
  const flingLeft = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => runOnJS(onFlingLeft)());
  }, [onFlingLeft]);

  const flingRight = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => runOnJS(onFlingRight)());
  }, [onFlingRight]);

  const flingDown = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.DOWN)
      .onEnd(() => runOnJS(onFlingDown)());
  }, [onFlingDown]);

  return (
    <GestureDetector gesture={Gesture.Race(flingLeft, flingRight, flingDown)}>
      {children}
    </GestureDetector>
  );
};

export default FlingGesture;
