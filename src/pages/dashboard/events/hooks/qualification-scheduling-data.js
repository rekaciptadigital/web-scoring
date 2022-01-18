const SCHEDULING = {
  INIT: "INIT_SCHEDULING",
  COMMON: "COMMON_SCHEDULES",
  SINGLE: "SINGLE_SCHEDULE",
  BULK: "BULK_SCHEDULES",
};

function schedulingReducer(state, action) {
  switch (action.type) {
    case SCHEDULING.INIT: {
      return { data: action.payload };
    }

    case SCHEDULING.COMMON: {
      const { competitionCategory, payload } = action;

      const updatedCommonSchedule = { ...state.data[competitionCategory].common, ...payload };

      const previousSchedulesGroup = state.data[competitionCategory];
      const updatedSchedulesGroup = {};
      for (const detailId in previousSchedulesGroup) {
        updatedSchedulesGroup[detailId] = { ...updatedCommonSchedule };
      }

      return {
        ...state,
        data: { ...state.data, [competitionCategory]: updatedSchedulesGroup },
      };
    }

    case SCHEDULING.SINGLE: {
      const { competitionCategory, detailId, payload } = action;
      return {
        ...state,
        data: {
          ...state.data,
          [competitionCategory]: {
            ...state.data[competitionCategory],
            [detailId]: {
              ...state.data[competitionCategory][detailId],
              ...payload,
            },
            // reset inputan tanggal yang atas
            common: { date: "", timeStart: "", timeEnd: "" },
          },
        },
      };
    }

    case SCHEDULING.BULK: {
      const { competitionCategory, payload } = action;
      return {
        ...state,
        data: { ...state.data, [competitionCategory]: { ...payload } },
      };
    }

    default: {
      return state;
    }
  }
}

export { schedulingReducer, SCHEDULING };
