import Realm from "realm";
import { Entry } from "./Entry";

export class Day extends Realm.Object {
  _id!: string;
  locked: boolean = false;
  entryObjects!: Realm.List<Entry>;
  excerpt: string = "";
  statsTexts: number = 0;
  statsRecordings: number = 0;
  statsImages: number = 0;

  static schema: Realm.ObjectSchema = {
    name: "Day",
    primaryKey: "_id",
    properties: {
      _id: "string",
      locked: "bool",
      entryObjects: "Entry[]",
      excerpt: "string",
      statsTexts: "int",
      statsRecordings: "int",
      statsImages: "int",
    },
  };
}
