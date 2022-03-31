import { differenceInDays, addDays, subDays } from "date-fns";
import stringUtil from "utils/stringUtil";
import { parseServerDatetime, formatServerDate } from "../utils/datetime";

/**
 * Dipakai ketika sama sekali belum ada data schedule/qualification time-nya
 */
function makeDefaultForm(eventDetail) {
  let eventStartDate = null;
  let eventEndDate = null;
  let numberOfDays = 2;

  if (eventDetail) {
    eventStartDate = parseServerDatetime(eventDetail.publicInformation.eventStart);
    eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);
    numberOfDays = differenceInDays(eventEndDate, eventStartDate) + 1;
  }

  let currentSessionDate = eventStartDate ? subDays(eventStartDate, 1) : null;
  return [...new Array(numberOfDays)].reduce((data) => {
    currentSessionDate = currentSessionDate ? addDays(currentSessionDate, 1) : null;
    return [
      ...data,
      {
        key: stringUtil.createRandom(),
        sessionDate: currentSessionDate,
        sessions: [
          {
            key: stringUtil.createRandom(),
            categoryDetail: null, // { value: "", label: "" },
            idQualificationTime: undefined,
            eventStartDatetime: eventStartDate,
            eventEndDatetime: eventStartDate,
          },
        ],
      },
    ];
  }, []);
}

/**
 * 1. ketika semua tanggal sudah punya data qualification time ada (happy path)
 * 2. ketika cuma ada 1 record atau sebagian tanggal yang terisi data....... (?)
 */
function makeStateSchedules(eventDetail, schedules) {
  let eventStartDate = null;
  let eventEndDate = null;
  let numberOfDays = 2;

  if (eventDetail) {
    eventStartDate = parseServerDatetime(eventDetail.publicInformation.eventStart);
    eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);
    numberOfDays = differenceInDays(eventEndDate, eventStartDate) + 1;
  }

  let currentSessionDate = eventStartDate ? subDays(eventStartDate, 1) : null;
  const formDataGrouped = [...new Array(numberOfDays)].reduce((data) => {
    currentSessionDate = currentSessionDate ? addDays(currentSessionDate, 1) : null;
    const dateAsString = formatServerDate(currentSessionDate);
    data[dateAsString] = {
      key: stringUtil.createRandom(),
      sessionDate: currentSessionDate,
      sessions: [],
    };
    return data;
  }, {});

  const mappedServerDataToForm = schedules.reduce((data, schedule) => {
    const dateTarget = parseServerDatetime(schedule.eventStartDatetime);
    const dateAsString = formatServerDate(dateTarget);
    return {
      ...data,
      [dateAsString]: {
        ...data[dateAsString],
        sessions: [
          ...data[dateAsString].sessions,
          {
            key: stringUtil.createRandom(),
            categoryDetail: {
              value: schedule.categoryDetailId,
              label: schedule.categoryDetailLabel,
            },
            idQualificationTime: schedule.idQualificationTime,
            eventStartDatetime: parseServerDatetime(schedule.eventStartDatetime),
            eventEndDatetime: parseServerDatetime(schedule.eventEndDatetime),
          },
        ],
      },
    };
  }, formDataGrouped);

  const resultFormData = Object.values(mappedServerDataToForm).map((day) => {
    if (day.sessions.length) {
      return day;
    }

    return {
      ...day,
      sessions: [
        {
          key: stringUtil.createRandom(),
          categoryDetail: null, // { value: "", label: "" },
          idQualificationTime: undefined,
          eventStartDatetime: eventStartDate,
          eventEndDatetime: eventStartDate,
        },
      ],
    };
  });

  return resultFormData;
}

export { makeDefaultForm, makeStateSchedules };
