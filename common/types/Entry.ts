import { FEELING_GROUP_NAMES } from "../constants/feelings";
import { Media } from "./Media";
import { Recording } from "./Recording";

export type Entry = {
  id: string;
  dayId: string;
  text?: string;
  recording?: Recording;
  media?: Media[];
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions?: string[];
  orderIndex: number;
  language: string;
};
