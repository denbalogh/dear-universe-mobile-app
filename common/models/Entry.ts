import { Model } from "@nozbe/watermelondb";
import { relation, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { Recording } from "@/common/types/Recording";

export default class Entry extends Model {
  static table = TableName.ENTRIES;
  static associations: Associations = {
    [TableName.DAYS]: { type: "belongs_to", key: "day_id" },
    [TableName.MEDIA]: { type: "has_many", foreignKey: "entry_id" },
  };

  @text("language") language: string = "en";
  @text("text") text?: string;
  @text("feelings_group") feelingsGroup: string = FEELING_GROUP_NAMES.NEUTRAL;
  @text("feelings_emotions") feelingsEmotions?: string;
  @text("order_index") orderIndex!: number;

  @relation(TableName.RECORDINGS, "recording_id") recording?: Recording;
}
