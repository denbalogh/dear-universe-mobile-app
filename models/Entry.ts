import Realm, { BSON } from "realm";
import { Day } from "./Day";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";

export class Feelings extends Realm.Object {
  name!: FEELING_GROUP_NAMES;
  emotions!: string[];

  static schema: Realm.ObjectSchema = {
    name: "Feelings",
    embedded: true,
    properties: {
      name: "string",
      emotions: "string[]",
    },
  };
}

export class VideoWithThumbnail extends Realm.Object {
  videoUri!: string;
  thumbnailUri!: string;

  static schema: Realm.ObjectSchema = {
    name: "VideoWithThumbnail",
    embedded: true,
    properties: {
      videoUri: "string",
      thumbnailUri: "string",
    },
  };
}

export class Entry extends Realm.Object<Entry, "day"> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  createdAt: Date = new Date();
  title?: string = "";
  description?: string = "";
  feelings?: Feelings;
  recordingUri?: string;
  imagesUri?: string[];
  videosWithThumbnail?: VideoWithThumbnail[];
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
      recordingUri: "string?",
      imagesUri: {
        type: "list",
        objectType: "string",
        default: [],
      },
      videosWithThumbnail: {
        type: "list",
        objectType: "VideoWithThumbnail",
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
