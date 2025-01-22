import { SettingsTheme } from "@/constants/settings";
import Realm from "realm";

export class Settings extends Realm.Object {
  _id!: string;
  theme: SettingsTheme = "system";

  static schema: Realm.ObjectSchema = {
    name: "Settings",
    primaryKey: "_id",
    properties: {
      _id: "string",
      theme: {
        type: "string",
        default: "system",
      },
    },
  };
}
