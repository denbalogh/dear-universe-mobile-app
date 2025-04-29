import { Model, Query } from "@nozbe/watermelondb";
import { text, children } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import Entry from "./Entry";
import Media from "./Media";

export default class Day extends Model {
  static table = TableName.DAYS;
  static associations: Associations = {
    [TableName.ENTRIES]: { type: "has_many", foreignKey: "day_id" },
  };

  @text("title") title?: string;
  @children(TableName.ENTRIES) entries?: Query<Entry>;

  async media() {
    let media: Media[] = [];

    const entries = (await this.entries?.fetch()) || [];
    for (const entry of entries) {
      media = [...media, ...((await entry.media?.fetch()) || [])];
    }

    return media;
  }

  async feelings() {
    const entries = (await this.entries?.fetch()) || [];
    return entries.map((entry) => entry.feelingsGroup);
  }

  async isEmpty() {
    const entries = (await this.entries?.fetch()) || [];
    return !this.title && entries.length === 0;
  }
}
