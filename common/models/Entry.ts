import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
  children,
  field,
  immutableRelation,
  text,
} from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import Media from "./Media";
import Day from "./Day";
import { FEELING_GROUP_NAMES } from "../constants/feelings";

export default class Entry extends Model {
  static table = TableName.ENTRIES;
  static associations: Associations = {
    [TableName.DAYS]: { type: "belongs_to", key: "day_id" },
    [TableName.MEDIA]: { type: "has_many", foreignKey: "entry_id" },
  };

  @text("language") language!: string;
  @text("text") text?: string;
  @text("feelings_group") feelingsGroup!: FEELING_GROUP_NAMES;
  @text("feelings_emotions") feelingsEmotions?: string;
  @field("order_index") orderIndex!: number;
  @text("recording_uri") recordingUri?: string;
  @immutableRelation(TableName.DAYS, "day_id") day!: Relation<Day>;
  @children(TableName.MEDIA) media?: Query<Media>;
}
