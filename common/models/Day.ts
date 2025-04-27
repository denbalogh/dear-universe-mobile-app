import { Model } from "@nozbe/watermelondb";
import { text, date } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";

export default class Day extends Model {
  static table = TableName.DAYS;
  static associations: Associations = {
    [TableName.ENTRIES]: { type: "has_many", foreignKey: "day_id" },
  };

  @text("title") title: string = "";
  @date("date_at") dateAt!: number;
}
