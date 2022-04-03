import { parseISO, format } from "date-fns";

function parseServerDatetime(dateString) {
  try {
    return parseISO(dateString);
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
