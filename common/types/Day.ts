import { Entry } from "./Entry";

export type Day = {
  id: string;
  dateAt: Date;
  title?: string;
  entries?: Entry[];
};
