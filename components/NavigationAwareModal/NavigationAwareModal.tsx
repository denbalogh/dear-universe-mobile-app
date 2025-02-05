import { useRootNavigationState } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Modal, ModalProps } from "react-native-paper";

type Props = ModalProps;

const NavigationAwareModal = ({ onDismiss, ...props }: Props) => {
  const { index } = useRootNavigationState();

  const prevIndex = useRef<number>(index);

  useEffect(() => {
    if (prevIndex.current !== index) {
      onDismiss?.();
    }
    prevIndex.current = index;
  }, [index, onDismiss]);

  return <Modal onDismiss={onDismiss} {...props} />;
};

export default NavigationAwareModal;
