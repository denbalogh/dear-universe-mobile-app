import { formatDateId, parseDateId } from "@/utils/date";
import { addDays, subDays } from "date-fns";

export const createInitDays = (
  startDate: Date = new Date(),
  COUNT: number = 20,
  firstDateForTesting: Date = new Date(), // for testing purposes, default is current day
): string[] => {
  let date = startDate;

  const days: string[] = [];
  for (
    let i = addDays(date, COUNT);
    i >= subDays(date, COUNT);
    i = subDays(i, 1)
  ) {
    if (i <= firstDateForTesting) {
      days.push(formatDateId(i));
    }
  }

  return days;
};

export const appendDays = (days: string[], COUNT: number = 20) => {
  const lastDate = parseDateId(days[days.length - 1]);

  const newDays = [];
  const untilDate = subDays(lastDate, COUNT);
  for (let i = subDays(lastDate, 1); i >= untilDate; i = subDays(i, 1)) {
    newDays.push(formatDateId(i));
  }

  return [...days, ...newDays];
};

export const prependDays = (
  days: string[],
  COUNT: number = 20,
  firstDateForTesting: Date = new Date(), // for testing purposes, default is current day
) => {
  const firstDate = parseDateId(days[0]);

  const newDays = [];
  const untilDate = addDays(firstDate, COUNT);
  for (let i = addDays(firstDate, 1); i <= untilDate; i = addDays(i, 1)) {
    if (i <= firstDateForTesting) {
      newDays.unshift(formatDateId(i));
    }
  }

  return [...newDays, ...days];
};

export const canPrependDays = (
  days: string[],
  firstDateForTesting: Date = new Date(), // for testing purposes, default is current day
) => {
  const firstDate = parseDateId(days[0]);
  return firstDate < firstDateForTesting;
};
