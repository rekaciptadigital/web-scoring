import * as React from "react";
import {
  makeDefaultForm,
  makeStateSchedules,
  makeDefaultFormMarathon,
  makeStateSchedulesMarathon,
} from "../utils/event-schedules";
import { eventConfigs } from "constants/index";

const { EVENT_TYPES } = eventConfigs;

function useFormSchedules(
  schedules,
  { eventType, eventDetail, categoryDetails }
) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    dispatch({
      type: "INIT_FORM",
      eventType,
      payload: { schedules, eventDetail, categoryDetails },
    });
  }, [eventType, eventDetail, categoryDetails, schedules]);

  const updateField = (keyParent, key, fieldName, payload) => {
    dispatch({
      type: "FIELD_CHANGE",
      key: { parent: keyParent, target: key },
      field: fieldName,
      payload: payload,
    });
  };

  return { ...state, updateField };
}

function formReducer(state, action) {
  switch (action.type) {
    case "INIT_FORM": {
      const isMarathon = _checkTypeIsMarathon(action.eventType);

      if (!action.payload.schedules?.length) {
        const data = isMarathon
          ? makeDefaultFormMarathon(
              action.payload.categoryDetails,
              action.payload.eventDetail
            )
          : makeDefaultForm(action.payload.eventDetail);
        console.log("dataInitNotSchedule:", data);
        return { ...state, data, isEmpty: true };
      }

      const data = isMarathon
        ? makeStateSchedulesMarathon(
            action.payload.categoryDetails,
            action.payload.schedules,
            action.payload.eventDetail
          )
        : makeStateSchedules(
            action.payload.eventDetail,
            action.payload.schedules,
            action.payload.categoryDetails
          );
      return { ...state, data, isEmpty: !action.payload.schedules.length };
    }

    case "FIELD_CHANGE": {
      return {
        ...state,
        data: state.data.map((day) => {
          if (day.key !== action.key.parent) {
            return day;
          }
          return {
            ...day,
            sessions: day.sessions.map((session) => {
              if (session.key !== action.key.target) {
                return session;
              }
              return { ...session, [action.field]: action.payload };
            }),
          };
        }),
      };
    }
  }
}

function _checkTypeIsMarathon(eventType = EVENT_TYPES.FULLDAY) {
  return eventType === EVENT_TYPES.MARATHON;
}

export { useFormSchedules };
