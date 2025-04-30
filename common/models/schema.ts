import { appSchema, tableSchema } from "@nozbe/watermelondb";

export enum TableName {
  DAYS = "days",
  ENTRIES = "entries",
  MEDIA = "media",
  RECORDINGS = "recordings",
  SETTINGS = "settings",
}

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.DAYS,
      columns: [{ name: "title", type: "string", isOptional: true }],
    }),
    tableSchema({
      name: TableName.ENTRIES,
      columns: [
        { name: "day_id", type: "string", isIndexed: true },
        { name: "text", type: "string", isOptional: true },
        { name: "feelings_group", type: "string" },
        { name: "feelings_emotions", type: "string", isOptional: true },
        { name: "order_index", type: "number" },
        { name: "language", type: "string" },
        { name: "recording_uri", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: TableName.MEDIA,
      columns: [
        { name: "uri", type: "string" },
        { name: "mediaType", type: "string" },
        { name: "entry_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: TableName.SETTINGS,
      columns: [
        { name: "theme", type: "string" },
        { name: "lock_code_hash", type: "string", isOptional: true },
        { name: "lock_use_biometrics", type: "boolean" },
        { name: "daily_reminder_at", type: "number", isOptional: true },
        { name: "daily_reminder_message", type: "string", isOptional: true },
        { name: "terms_understood", type: "boolean" },
      ],
    }),
  ],
});
