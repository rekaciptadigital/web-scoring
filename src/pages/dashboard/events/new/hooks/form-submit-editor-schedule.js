import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { addHours } from "date-fns";
import { stringUtil, datetime } from "utils";
import { syncTimeTo } from "../../new/utils/datetime";

function useScheduleEditorForm(initialValues, eventId) {
  const cleanValues = React.useRef(initialValues);
  const [state, dispatch] = React.useReducer(editorReducer, {
    data: initialValues,
    // errors: {}, // <- dipake untuk validasi kalau nanti butuh
  });

  const { data: submitData, ...formFetcher } = useFetcher();
  const fetcherState = { ...formFetcher, submitData };

  const isClean = React.useMemo(
    () => _checkIfFormClean(cleanValues.current.sessions, state.data.sessions),
    [state.data]
  );

  const updateField = (key, fieldName, value) => {
    dispatch({
      type: "FIELD_CHANGE",
      key: key,
      field: fieldName,
      payload: value,
    });
  };

  const createEmptySchedule = () => dispatch({ type: "CREATE_EMPTY_SCHEDULE" });
  const createSchedule = (categoryDetail) => {
    dispatch({ type: "CREATE_SCHEDULE_WITH_DEFAULT", payload: categoryDetail });
  };

  const removeScheduleItem = (key) => dispatch({ type: "REMOVE_SCHEDULE_ITEM", key: key });

  const submitSchedules = ({ onSuccess }) => {
    const payload = makePayloadScheduleForm(eventId, state.data, cleanValues.current);
    const postFunction = () => EventsService.storeQualificationTimeV2(payload);
    formFetcher.runAsync(postFunction, { onSuccess });
  };

  return {
    ...state,
    ...fetcherState,
    isClean,
    updateField,
    createEmptySchedule,
    removeScheduleItem,
    submitSchedules,
    createSchedule,
  };
}

function editorReducer(state, action) {
  if (action.type === "INIT_FORM") {
    return { ...state, data: action.payload };
  } else if (action.type === "FIELD_CHANGE") {
    return {
      ...state,
      data: {
        ...state.data,
        sessions: state.data.sessions.map((session) => {
          if (session.key !== action.key) {
            return session;
          }
          return {
            ...session,
            [action.field]: action.payload,
          };
        }),
      },
    };
  } else if (action.type === "CREATE_EMPTY_SCHEDULE") {
    return {
      ...state,
      data: {
        ...state.data,
        sessions: [
          ...state.data.sessions,
          {
            key: stringUtil.createRandom(),
            categoryDetail: null,
            idQualificationTime: undefined,
            eventStartDatetime: null,
            eventEndDatetime: null,
          },
        ],
      },
    };
  } else if (action.type === "CREATE_SCHEDULE_WITH_DEFAULT") {
    const lastIndex = state.data.sessions.length - 1;
    const lastTimeStart = state.data.sessions[lastIndex].eventStartDatetime;
    const lastTimeEnd = addHours(lastTimeStart, 1);

    return {
      ...state,
      data: {
        ...state.data,
        sessions: [
          ...state.data.sessions,
          {
            key: stringUtil.createRandom(),
            categoryDetail: action.payload,
            idQualificationTime: undefined,
            eventStartDatetime: lastTimeStart,
            eventEndDatetime: lastTimeEnd,
          },
        ],
      },
    };
  } else if (action.type === "REMOVE_SCHEDULE_ITEM") {
    return {
      ...state,
      data: {
        ...state.data,
        sessions: state.data.sessions
          .map((session) => {
            if (session.key !== action.key) {
              return session;
            }
            return { ...session, shouldDelete: true };
          })
          .filter(
            (session) =>
              !(session.key === action.key && session.shouldDelete && !session.idQualificationTime)
          ),
      },
    };
  }
  return state;
}

function makePayloadScheduleForm(eventId, editorFormdata, cleanValues) {
  return {
    event_id: eventId,
    qualificationTime: editorFormdata.sessions
      .map((session, index) => {
        const currentCleanValue = cleanValues.sessions[index];
        const isClean = _checkIfScheduleDataClean(currentCleanValue, session);

        // Tanggal yang nggak diedit (clean) diabaikan dari payload,
        // biar gak dikirim karena bisa error di backend di "kondisi tertentu"
        if (isClean) {
          return undefined;
        }

        // value umum: create/edit/delete
        const values = {
          qualification_time_id: session.idQualificationTime, // kalau create, `undefined`
          category_detail_id: session.categoryDetail?.value,
          event_start_datetime: datetime.formatServerDatetime(
            syncTimeTo(editorFormdata.sessionDate, session.eventStartDatetime)
          ),
          event_end_datetime: datetime.formatServerDatetime(
            syncTimeTo(editorFormdata.sessionDate, session.eventEndDatetime)
          ),
        };

        // value delete
        if (session.shouldDelete) {
          return { deleted: 1, ...values };
        }

        // value create & edit
        return values;
      })
      .filter((session) => Boolean(session)),
  };
}

function _checkIfScheduleDataClean(currentCleanValue, session) {
  const fields = Object.keys(session).filter((fieldName) => fieldName !== "key");
  const isClean = fields.every((fieldName) => {
    return session[fieldName] === currentCleanValue?.[fieldName];
  });
  return isClean;
}

function _checkIfFormClean(cleanSessions, formSessions) {
  const isClean = formSessions.every((session, index) => {
    const isSessionClean = _checkIfScheduleDataClean(cleanSessions[index], session);
    return isSessionClean;
  });
  return isClean;
}

export { useScheduleEditorForm };
