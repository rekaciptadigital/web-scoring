import { differenceInDays, addDays, subDays, addHours } from "date-fns";
import { datetime, stringUtil } from "utils";

const { parseServerDatetime, formatServerDate } = datetime;

/* ================================ */
// FULLDAY

/**
 * Dipakai ketika sama sekali belum ada data schedule/qualification time-nya
 */
function makeDefaultForm(eventDetail) {
  const eventStartDate = parseServerDatetime(eventDetail?.publicInformation.eventStart);
  const eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);
  const numberOfDays =
    eventStartDate && eventEndDate ? differenceInDays(eventEndDate, eventStartDate) + 1 : 1;

  let currentSessionDate = eventStartDate ? subDays(eventStartDate, 1) : null;
  return [...new Array(numberOfDays)].reduce((data) => {
    currentSessionDate = currentSessionDate ? addDays(currentSessionDate, 1) : null;

    if (!currentSessionDate) {
      return data;
    }

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
            // Hati-hati nama dari backend bisa membingungkan.
            // *Event* (start/end) datetime ini maksudnya datetime untuk jadwal kualifikasi,
            // bukan tanggal event.
            // API POST minta nama key payload-nya ini
            eventStartDatetime: currentSessionDate,
            eventEndDatetime: addHours(currentSessionDate, 1),
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
function makeStateSchedules(eventDetail, schedules, categories) {
  const categoriesById = _makeCategoriesById(categories);
  const eventStartDate = parseServerDatetime(eventDetail?.publicInformation.eventStart);
  const eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);
  const numberOfDays =
    eventStartDate && eventEndDate ? differenceInDays(eventEndDate, eventStartDate) + 1 : 1;

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

    // Tanpa ini, eksplode. Tapi sebenernya gak perlu karena harusnya
    // jadwal yang sudah terbuat itu sudah masuk ke range tanggal mulai &
    // selesai event. Antisipasi jadwal yang lolos validasi di luar range
    // tanggal lomba event. Contoh kasus data jadwal di Series 1.
    if (!data[dateAsString]) data[dateAsString] = {};
    if (!data[dateAsString].sessions) data[dateAsString].sessions = [];

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
              data: categoriesById.get(schedule.categoryDetailId),
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
          eventStartDatetime: day.sessionDate,
          eventEndDatetime: addHours(day.sessionDate, 1),
        },
      ],
    };
  });

  return resultFormData;
}

/* ================================ */
// MARATHON

function makeDefaultFormMarathon(categoryDetails, eventDetail) {
  const eventStartDate = parseServerDatetime(eventDetail?.publicInformation.eventStart);
  const eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);

  const groupedCategories = _groupByCompetitionId(categoryDetails);
  const competitionIds = groupedCategories ? Object.keys(groupedCategories) : [];

  const formState = competitionIds.map((competitionCategoryId) => {
    const categoryDetails = groupedCategories[competitionCategoryId];

    const parentCompetitionCategory = {
      key: stringUtil.createRandom(),
      competitionCategory: competitionCategoryId,
      schedules: [],
    };

    const schedules = categoryDetails.map((categoryDetail) => ({
      key: stringUtil.createRandom(),
      categoryDetail: {
        value: categoryDetail.id,
        label: categoryDetail.labelCategory,
      },
      idQualificationTime: undefined,
      eventStartDatetime: eventStartDate,
      eventEndDatetime: eventEndDate,
    }));

    return {
      ...parentCompetitionCategory,
      schedules,
    };
  });

  return formState;
}

function makeStateSchedulesMarathon(categoryDetails, schedules, eventDetail) {
  const eventStartDate = parseServerDatetime(eventDetail?.publicInformation.eventStart);
  const eventEndDate = parseServerDatetime(eventDetail?.publicInformation.eventEnd);

  const structuredSchedules = _arrayToObject(schedules, "categoryDetailId");
  const groupedCategories = _groupByCompetitionId(categoryDetails);
  const competitionIds = groupedCategories ? Object.keys(groupedCategories) : [];

  const formState = competitionIds.map((competitionCategoryId) => {
    const categoryDetails = groupedCategories[competitionCategoryId];

    const parentCompetitionCategory = {
      key: stringUtil.createRandom(),
      competitionCategory: competitionCategoryId,
      schedules: [],
    };

    const schedules = categoryDetails.map((categoryDetail) => {
      const schedule = structuredSchedules[categoryDetail.id];
      const idQualificationTime = schedule?.idQualificationTime || undefined;
      const eventStartDatetime = schedule
        ? parseServerDatetime(schedule.eventStartDatetime)
        : eventStartDate;
      const eventEndDatetime = schedule
        ? parseServerDatetime(schedule.eventEndDatetime)
        : eventEndDate;

      return {
        key: stringUtil.createRandom(),
        categoryDetail: {
          value: categoryDetail.id,
          label: categoryDetail.labelCategory,
        },
        idQualificationTime: idQualificationTime,
        eventStartDatetime: eventStartDatetime,
        eventEndDatetime: eventEndDatetime,
      };
    });

    return {
      ...parentCompetitionCategory,
      schedules,
    };
  });

  return formState;
}

/* ================================ */
// local utils

function _groupByCompetitionId(categoryDetails) {
  if (!categoryDetails?.length) {
    return null;
  }

  const groupedDataByCompetitionId = {};

  categoryDetails.forEach((categoryDetail) => {
    const { competitionCategoryId } = categoryDetail;
    if (!groupedDataByCompetitionId[competitionCategoryId]) {
      groupedDataByCompetitionId[competitionCategoryId] = [];
    }
    groupedDataByCompetitionId[competitionCategoryId].push(categoryDetail);
  });

  return groupedDataByCompetitionId;
}

function _arrayToObject(schedules, targetKeyName) {
  const structuredObject = {};

  schedules.forEach((schedule) => {
    const accessId = schedule[targetKeyName];
    structuredObject[accessId] = schedule;
  });

  return structuredObject;
}

function _makeCategoriesById(categories) {
  const grouped = {};
  const instance = {
    get: (id) => grouped[id],
  };

  if (!categories?.length) {
    return instance;
  }

  for (const category of categories) {
    grouped[category.id] = category;
  }

  return instance;
}

export { makeDefaultForm, makeStateSchedules, makeDefaultFormMarathon, makeStateSchedulesMarathon };
