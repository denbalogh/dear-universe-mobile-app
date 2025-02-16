import { format } from "date-fns/format";
import { parse } from "date-fns/parse";

const HOURS_MINUTES_FORMAT = "HH:mm";

export const formatDateToHoursMinutes = (date: Date): string => {
  return format(date, HOURS_MINUTES_FORMAT);
};

export const parseHoursMinutesToDate = (time: string): Date => {
  if (time === "") {
    return new Date();
  }

  return parse(time, HOURS_MINUTES_FORMAT, new Date());
};

export const isEqualHoursMinutes = (date1: Date, date2: Date): boolean => {
  return formatDateToHoursMinutes(date1) === formatDateToHoursMinutes(date2);
};
