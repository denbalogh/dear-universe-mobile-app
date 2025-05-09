import {
  formatDayId,
  formatMonthYear,
  isMonthYearFormat,
  parseDayId,
} from "@/common/utils/date";
import { subDays } from "date-fns/subDays";

export const createDaysUntilDate = (
  untilDate: Date = new Date(),
  extraDays: number = 20,
  startDateForTesting: Date = new Date(),
): string[] => {
  const lastDateInTheList = subDays(untilDate, extraDays);
  const days: string[] = [];
  for (let i = startDateForTesting; i >= lastDateInTheList; i = subDays(i, 1)) {
    days.push(formatDayId(i));

    if (i.getDate() === 1) {
      days.push(formatMonthYear(subDays(i, 1)));
    }
  }

  return days;
};

export const appendDays = (days: string[], COUNT: number = 20) => {
  const lastItem = days[days.length - 1];
  let lastDate = parseDayId(lastItem);

  // If the last item is a month year format, then the last date is the day before it
  if (isMonthYearFormat(lastItem)) {
    lastDate = parseDayId(days[days.length - 2]);
  }

  const newDays = [];
  const untilDate = subDays(lastDate, COUNT);
  for (let i = subDays(lastDate, 1); i >= untilDate; i = subDays(i, 1)) {
    newDays.push(formatDayId(i));

    if (i.getDate() === 1) {
      newDays.push(formatMonthYear(subDays(i, 1)));
    }
  }

  return [...days, ...newDays];
};
