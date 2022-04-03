import * as React from "react";
import { makeDefaultForm, makeStateSchedules } from "../utils/event-schedules";

function useFormSchedules(schedules, eventDetail) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    dispatch({ type: "INIT_FORM", payload: { eventDetail, schedules } });
  }, [eventDetail, schedules]);

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
      if (!action.payload.schedules?.length) {
        return {
          ...state,
          data: makeDefaultForm(action.payload.eventDetail),
          isEmpty: true,
        };
      }

      return {
        ...state,
        data: makeStateSchedules(action.payload.eventDetail, action.payload.schedules),
        isEmpty: !action.payload.schedules.length,
      };
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

export { useFormSchedules };
