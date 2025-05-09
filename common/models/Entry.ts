import { Model, Relation } from "@nozbe/watermelondb";
import {
  field,
  immutableRelation,
  json,
  text,
} from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import Day from "./Day";
import { FEELING_GROUP_NAMES } from "../constants/feelings";
import { Media } from "../types/Media";
import { z } from "zod";

const sanitizeMediaJson = (parsedJSON: any) => {
  const mediaSchema = z.array(
    z.object({
      uri: z.string(),
      mediaType: z.enum(["image", "video"]),
    }),
  );

  if (mediaSchema.safeParse(parsedJSON).success) {
    return parsedJSON;
  }

  return [];
};

const sanitizeEmotionsJson = (parsedJSON: any) => {
  const feelingsEmotionsSchema = z.array(z.string());

  if (feelingsEmotionsSchema.safeParse(parsedJSON).success) {
    return parsedJSON;
  }

  return [];
};

export default class Entry extends Model {
  static table = TableName.ENTRIES;
  static associations: Associations = {
    [TableName.DAYS]: { type: "belongs_to", key: "day_id" },
  };

  @text("language") language!: string;
  @text("text") text!: string;
  @text("feelings_group") feelingsGroup!: FEELING_GROUP_NAMES;
  @field("order_index") orderIndex!: number;
  @text("recording_uri") recordingUri!: string;
  @immutableRelation(TableName.DAYS, "day_id") day!: Relation<Day>;
  @json("media", sanitizeMediaJson) media!: Media[];
  @json("feelings_emotions", sanitizeEmotionsJson) feelingsEmotions!: string[];
}
