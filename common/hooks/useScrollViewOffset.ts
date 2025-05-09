import { useCallback, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const useScrollViewOffset = () => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleOnScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollOffset(y);
    },
    [],
  );

  return { scrollOffset, handleOnScroll };
};

export default useScrollViewOffset;
