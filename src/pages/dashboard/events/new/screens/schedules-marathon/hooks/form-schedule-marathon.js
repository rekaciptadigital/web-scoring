import * as React from "react";

function useFormScheduleMarathon(schedules) {
  const [state, dispatch] = React.useReducer(editorReducer, {
    data: schedules,
    // status: "uninitialized",
    // errors: {},
  });

  const updateField = (key, fieldName, value) => {
    dispatch({
      type: "FIELD_CHANGE",
      key: key,
      field: fieldName,
      payload: value,
    });
  };

  return { ...state, updateField };
}

function editorReducer(state, action) {
  if (action.type === "FIELD_CHANGE") {
    return {
      ...state,
      data: state.data.map((schedule) => {
        if (schedule.key !== action.key) {
          return schedule;
        }
        return { ...schedule, [action.field]: action.payload };
      }),
    };
  }

  return state;
}

export { useFormScheduleMarathon };
