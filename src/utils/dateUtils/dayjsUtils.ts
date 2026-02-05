import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/**
 * =========================
 * PARSING
 * =========================
 */

/** Safely parse any input to Dayjs or null */
export const parseDateDayjs = (
  value?: string | Date | Dayjs | null
): Dayjs | null => {
  if (!value) return null;

  const d = dayjs(value);
  return d.isValid() ? d : null;
};

/**
 * =========================
 * FORMATTING
 * =========================
 */

/** Format date for UI display */
export const formatForUI = (
  value?: string | Date | Dayjs | null,
  format = "DD MMM YYYY"
): string => {
  const d = parseDateDayjs(value);
  return d ? d.format(format) : "";
};

/** Format date for input[type="date"] */
export const formatForInput = (
  value?: string | Date | Dayjs | null
): string => {
  const d = parseDateDayjs(value);
  return d ? d.format("YYYY-MM-DD") : "";
};

/**
 * =========================
 * SERVER COMMUNICATION
 * =========================
 */

/** Convert client date → UTC ISO string (send to backend) */
export const toUTCString = (
  value?: string | Date | Dayjs | null
): string | null => {
  const d = parseDateDayjs(value);
  return d ? d.utc().toISOString() : null;
};

/** Convert UTC date from server → local Dayjs */
export const fromUTC = (value?: string | null): Dayjs | null => {
  if (!value) return null;
  return dayjs.utc(value).local();
};

/**
 * =========================
 * VALIDATION
 * =========================
 */

/** Check if value is a valid date */
export const isValidDate = (value?: string | Date | Dayjs | null): boolean => {
  return !!parseDateDayjs(value);
};

/** Check if date is before today */
export const isPastDate = (value?: string | Date | Dayjs | null): boolean => {
  const d = parseDateDayjs(value);
  return d ? d.isBefore(dayjs(), "day") : false;
};

/** Check if date is after today */
export const isFutureDate = (value?: string | Date | Dayjs | null): boolean => {
  const d = parseDateDayjs(value);
  return d ? d.isAfter(dayjs(), "day") : false;
};
