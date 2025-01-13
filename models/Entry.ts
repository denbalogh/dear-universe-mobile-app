import Realm, { BSON } from "realm";
import { Day } from "./Day";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";

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
  recordingUri?: string = "";
  imagesUri?: string[] = [];
  videosWithThumbnail?: VideoWithThumbnail[] = [];
  feelingsGroupName?: FEELING_GROUP_NAMES | "" = "";
  feelingsEmotions?: string[] = [];
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
      title: {
        type: "string",
        default: "",
      },
      description: {
        type: "string",
        default: "",
      },
      recordingUri: {
        type: "string",
        default: "",
      },
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
      feelingsGroupName: {
        type: "string",
        default: "",
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
