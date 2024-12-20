import Realm, { BSON } from "realm";
import { Day } from "./Day";
import { Feelings } from "./Feelings";

export class Entry extends Realm.Object<Entry, "day"> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  createdAt: Date = new Date();
  title?: string = "";
  description?: string = "";
  feelings?: Feelings;
  recordingURI?: string;
  imagesURI?: string[];
  day!: Day;

  static schema: Realm.ObjectSchema = {
    name: "Entry",
    primaryKey: "_id",
    properties: {
      _id: {
        type: "objectId",
        default: () => new BSON.ObjectId(),
      },
      createdAt: {
        type: "date",
        default: () => new Date(),
      },
      title: "string?",
      description: "string?",
      feelings: "Feelings?",
      recordingURI: "string?",
      imagesURI: {
        type: "list",
        objectType: "string",
        default: [],
      },
      day: {
        type: "linkingObjects",
        objectType: "Day",
        property: "entryObjects",
      },
    },
  };
}
