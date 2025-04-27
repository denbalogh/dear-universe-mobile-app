import { format } from "date-fns/format";
import { isMatch } from "date-fns/isMatch";
import { isToday } from "date-fns/isToday";
import { parse } from "date-fns/parse";

const DATE_AT_FORMAT = "d_M_y";

export const parseDateAt = (date: string): Date => {
  return parse(date, DATE_AT_FORMAT, new Date());
};

export const formatDateAt = (date: Date): string => {
  return format(date, DATE_AT_FORMAT);
};

export const isDateAtFormat = (date: string): boolean => {
  return isMatch(date, DATE_AT_FORMAT);
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
