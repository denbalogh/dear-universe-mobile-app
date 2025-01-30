import { format, isMatch, isToday, parse } from "date-fns";

const ID_DATE_FORMAT = "d_M_y";

export const parseDateId = (date: string): Date => {
  return parse(date, ID_DATE_FORMAT, new Date());
};

export const formatDateId = (date: Date): string => {
  return format(date, ID_DATE_FORMAT);
};

export const isDateIdFormat = (date: string): boolean => {
  return isMatch(date, ID_DATE_FORMAT);
};

const MONTH_YEAR_FORMAT = "MMMM y";

export const formatMonthYear = (date: Date): string => {
  return format(date, MONTH_YEAR_FORMAT);
};

export const isMonthYearFormat = (date: string): boolean => {
  return isMatch(date, MONTH_YEAR_FORMAT);
};

export const formatMonthName = (date: Date): string => {
  return format(date, "MMMM");
};

const FULL_DATE_FORMAT = "do MMM. yyyy";

export const formatFullDate = (date: Date): string => {
  const formatted = format(date, FULL_DATE_FORMAT);
  return isToday(date) ? `Today, ${formatted}` : formatted;
};
