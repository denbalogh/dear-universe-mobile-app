import React, { ReactNode } from "react";
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
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => runOnJS(onFlingLeft)());

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => runOnJS(onFlingRight)());

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => runOnJS(onFlingDown)());

  return (
    <GestureDetector gesture={Gesture.Race(flingLeft, flingRight, flingDown)}>
      {children}
    </GestureDetector>
  );
};

export default FlingGesture;
