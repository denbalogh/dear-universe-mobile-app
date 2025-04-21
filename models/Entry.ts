import Realm, { BSON } from "realm";
import { Day } from "./Day";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { MediaType } from "expo-image-picker";

export class Media extends Realm.Object {
  uri?: string;
  mediaType!: MediaType;

  static schema: Realm.ObjectSchema = {
    name: "Media",
    embedded: true,
    properties: {
      uri: "string",
      mediaType: "string",
    },
  };
}

export class Entry extends Realm.Object<Entry, "day"> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  createdAt: Date = new Date();
  text: string = "";
  recordingUri: string = "";
  media: Media[] = [];
  feelingsGroup: FEELING_GROUP_NAMES = FEELING_GROUP_NAMES.NEUTRAL;
  feelingsEmotions: string[] = [];
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
      text: {
        type: "string",
        default: "",
      },
      recordingUri: {
        type: "string",
        default: "",
      },
      media: {
        type: "list",
        objectType: "Media",
        default: [],
      },
      feelingsGroup: {
        type: "string",
        default: FEELING_GROUP_NAMES.NEUTRAL,
      },
      feelingsEmotions: {
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
