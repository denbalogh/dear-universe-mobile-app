import { Model } from "@nozbe/watermelondb";
import { relation, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import { MediaType } from "@/common/types/Media";
import Entry from "./Entry";

export default class Media extends Model {
  static table = TableName.MEDIA;
  static associations: Associations = {
    [TableName.ENTRIES]: { type: "belongs_to", key: "entry_id" },
  };

  @text("uri") uri!: string;
  @text("mediaType") mediaType!: MediaType;
  @relation(TableName.ENTRIES, "entry_id") entry!: Entry;
}
