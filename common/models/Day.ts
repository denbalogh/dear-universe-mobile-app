import { Model, Query } from "@nozbe/watermelondb";
import { text, children } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { Associations } from "@nozbe/watermelondb/Model";
import Entry from "./Entry";
import { Media } from "../types/Media";

export default class Day extends Model {
  static table = TableName.DAYS;
  static associations: Associations = {
    [TableName.ENTRIES]: { type: "has_many", foreignKey: "day_id" },
  };

  @text("title") title!: string;
  @children(TableName.ENTRIES) entries?: Query<Entry>;

  async media() {
    const entries = (await this.entries?.fetch()) || [];
    return entries.reduce((acc: Media[], { media }) => {
      if (media) return [...acc, ...media];
      return acc;
    }, []);
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
