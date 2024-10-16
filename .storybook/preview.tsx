import React from 'react';
import type { Preview } from '@storybook/react';
import { StyleSheet, View } from 'react-native';

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={styles.wrapper}>
        <Story />
      </View>
    ),
  ],
};

export default preview;

const styles = StyleSheet.create({
  wrapper:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  }
})
