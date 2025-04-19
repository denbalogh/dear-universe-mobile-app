import Realm from "realm";
import { Entry } from "./Entry";

export class Day extends Realm.Object {
  _id!: string;
  entryObjects!: Realm.List<Entry>;
  title: string = "";

  static schema: Realm.ObjectSchema = {
    name: "Day",
    primaryKey: "_id",
    properties: {
      _id: "string",
      entryObjects: "Entry[]",
      title: {
        type: "string",
        default: "",
      },
    },
  };
}
