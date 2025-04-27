import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";

export default class Recording extends Model {
  static table = TableName.RECORDINGS;
  static associations: Associations = {
    [TableName.ENTRIES]: { type: "belongs_to", key: "entry_id" },
  };

  @text("uri") uri!: string;
  @text("transcription") transcription?: string;
}
