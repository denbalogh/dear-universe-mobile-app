import Realm from "realm";
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
