import { CalendarDate, parseDate } from "@internationalized/date";

export const stringToDateValue = (value?: string): CalendarDate | null => {
  if (!value) return null;
  try {
    return parseDate(value); // expects YYYY-MM-DD
  } catch {
    return null;
  }
};
export const DateUtils = () => {
  const year = new Date().getFullYear();

  return { year };
};
