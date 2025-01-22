import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

type Props = {
  closeDrawer: () => void;
};

const SettingsDrawerContent = ({ closeDrawer }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Appbar.Header>
        <Appbar.BackAction onPress={closeDrawer} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <View></View>
    </View>
  );
};

export default SettingsDrawerContent;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
