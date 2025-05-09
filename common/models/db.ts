import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema, { TableName } from "./schema";
import migrations from "./migrations";
import Day from "./Day";
import Entry from "./Entry";
import Settings from "./Settings";
import { Platform } from "react-native";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === "ios",
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error("Database setup failed", error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [Day, Entry, Settings],
});

export default database;

export const daysCollection = database.get<Day>(TableName.DAYS);
export const entriesCollection = database.get<Entry>(TableName.ENTRIES);
export const settingsCollection = database.get<Settings>(TableName.SETTINGS);
