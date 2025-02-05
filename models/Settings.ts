import { SettingsTheme } from "@/constants/settings";
import Realm from "realm";

export class Settings extends Realm.Object {
  _id!: string;
  theme: SettingsTheme = "system";
  lockCodeHash: string = "";
  lockUseBiometrics: boolean = false;
  dailyReminderTime: string = "";
  dailyReminderMessage: string = "";

  static schema: Realm.ObjectSchema = {
    name: "Settings",
    primaryKey: "_id",
    properties: {
      _id: "string",
      theme: {
        type: "string",
        default: "system",
      },
      lockCodeHash: {
        type: "string",
        default: "",
      },
      lockUseBiometrics: {
        type: "bool",
        default: false,
      },
      dailyReminderTime: {
        type: "string",
        default: "",
      },
      dailyReminderMessage: {
        type: "string",
        default: "",
      },
    },
  };
}
