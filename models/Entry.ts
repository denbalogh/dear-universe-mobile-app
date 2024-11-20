import Realm, { BSON } from "realm";
import { Day } from "./Day";

export class Entry extends Realm.Object<Entry, "day"> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  createdAt: Date = new Date();
  title?: string = "";
  description?: string = "";
  day!: Day;

  static schema: Realm.ObjectSchema = {
    name: "Entry",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      createdAt: "date",
      title: "string?",
      description: "string?",
      day: {
        type: "linkingObjects",
        objectType: "Day",
        property: "entryObjects",
      },
    },
  };
}
