import { useRootNavigationState } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { Modal, ModalProps } from "react-native-paper";

type Props = ModalProps;

const NavigationAwareModal = ({
  onDismiss,
  contentContainerStyle,
  ...props
}: Props) => {
  const { index } = useRootNavigationState();
  const { height } = useWindowDimensions();

  const prevIndex = useRef<number>(index);

  useEffect(() => {
    if (prevIndex.current !== index) {
      onDismiss?.();
    }
    prevIndex.current = index;
  }, [index, onDismiss]);

  return (
    <Modal
      onDismiss={onDismiss}
      contentContainerStyle={[{ height }, contentContainerStyle]}
      {...props}
    />
  );
};

export default NavigationAwareModal;
