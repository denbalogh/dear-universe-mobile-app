import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

type Props = {
  buttons: ButtonProps[];
} & ViewProps;

const BottomButtons = ({ buttons, style, ...props }: Props) => {
  if (!buttons.length) {
    return null;
  }

  return (
    <View style={[style, styles.buttonsWrapper]} {...props}>
      {buttons.map((button, index) => (
        <Button key={index} {...button} />
      ))}
    </View>
  );
};

export default BottomButtons;

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
