import { format, parse } from "date-fns";

const ID_DATE_FORMAT = "d/M/y";

export const parseDateId = (date: string): Date => {
  return parse(date, ID_DATE_FORMAT, new Date());
};

export const formatDateId = (date: Date): string => {
  return format(date, ID_DATE_FORMAT);
};

export const formatMonthYear = (date: Date): string => {
  return format(date, "MMMM y");
};

export const formatMonthName = (date: Date): string => {
  return format(date, "MMMM");
};
