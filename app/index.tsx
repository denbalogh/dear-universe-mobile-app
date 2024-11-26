import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import * as _ from "lodash";
import InfiniteDaysList from "@/components/InfiniteDaysList/InfiniteDaysList";
import { formatMonthYear } from "@/utils/date";

const App = () => {
  const theme = useTheme();
  const [monthYear, setMonthYear] = useState(formatMonthYear(new Date()));

  return (
    <View style={styles.wrapper}>
      <Stack.Screen
        options={{
          header: ({ navigation }) => (
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
              <Appbar.Content
                title={monthYear}
                titleStyle={{ color: theme.colors.onBackground }}
              />
              <Appbar.Action
                icon="cog"
                onPress={() => console.log("open settings")}
                color={theme.colors.onBackground}
              />
            </Appbar.Header>
          ),
        }}
      />
      <InfiniteDaysList onMonthYearChange={setMonthYear} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
