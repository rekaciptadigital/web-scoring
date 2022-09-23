import { getHours, getMinutes, setHours, setMinutes } from "date-fns";

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

export { syncTimeTo };
