import { parseISO, format, isValid } from "date-fns";
import { getHours, getMinutes, setHours, setMinutes } from "date-fns";

function parseServerDatetime(dateString) {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
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

/**
 * Menyamakan time (jam & menit) dari date yang diinput di konfig
 * dengan date default (referensi)
 * @param {Date} date Date yang diinputkan
 * @param {Date} referenceDate Date yang diambil referensi time-nya
 * @returns Date Objek Date yang sudah disamakan timenya
 */
function syncTimeTo(date, referenceDate) {
  if (!date) {
    return undefined;
  }
  if (!referenceDate) {
    return date;
  }
  const refHours = getHours(referenceDate);
  const refMinutes = getMinutes(referenceDate);
  const synced = setHours(setMinutes(date, refMinutes), refHours);
  return synced;
}

export { parseServerDatetime, formatServerDatetime, formatServerDate, syncTimeTo };
