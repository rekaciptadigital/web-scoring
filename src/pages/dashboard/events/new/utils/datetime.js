import { parseISO, format, isValid } from "date-fns";

function parseServerDatetime(dateString) {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return date;
    }
    throw new Error(date);
  } catch {
    return null;
  }
}

function formatServerDatetime(date) {
  try {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  } catch {
    return undefined;
  }
}

function formatServerDate(date) {
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return undefined;
  }
}

export { parseServerDatetime, formatServerDatetime, formatServerDate };
