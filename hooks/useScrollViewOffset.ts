import { useCallback, useMemo, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

type ReturnType = {
  scrollOffset: number;
  handleOnScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const useScrollViewOffset = (): ReturnType => {
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

  return useMemo(
    () => ({ scrollOffset, handleOnScroll }),
    [scrollOffset, handleOnScroll],
  );
};

export default useScrollViewOffset;
