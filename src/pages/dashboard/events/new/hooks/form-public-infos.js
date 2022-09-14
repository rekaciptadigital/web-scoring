import * as React from "react";
import { makeStatePublicInfos } from "../utils/event-public-infos";

import { setHours, setMinutes } from "date-fns";
import { stringUtil } from "utils";

function useFormPublicInfos(eventDetail) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    if (!eventDetail) {
      dispatch({ type: "INIT_FORM" });
    } else {
      dispatch({ type: "INIT_FORM", payload: makeStatePublicInfos(eventDetail) });
    }
  }, [eventDetail]);

  const updateField = (fieldName, value) => {
    dispatch({
      type: "FIELD_CHANGE",
      field: fieldName,
      payload: value,
    });
  };

  const updateRegistrationStart = (value) => {
    dispatch({ type: "REGISTRATION_START", payload: value });
  };

  const updateRegistrationEnd = (value) => {
    dispatch({ type: "REGISTRATION_END", payload: value });
  };

  const updateEventStart = (value) => {
    dispatch({ type: "EVENT_START", payload: value });
  };

  const updateEventEnd = (value) => {
    dispatch({ type: "EVENT_END", payload: value });
  };

  const addExtraInfoItem = (value) => {
    dispatch({
      type: "ADD_EXTRA_INFO",
      value: {
        title: value.title,
        description: value.description,
      },
    });
  };

  const updateExtraInfoItem = (value) => {
    dispatch({
      type: "EDIT_EXTRA_INFO",
      key: value.key,
      value: {
        title: value.title,
        description: value.description,
      },
    });
  };

  const removeExtraInfoItem = (key) => {
    dispatch({ type: "REMOVE_EXTRA_INFO", key: key });
  };

  return {
    ...state,
    updateField,
    updateRegistrationStart,
    updateRegistrationEnd,
    updateEventStart,
    updateEventEnd,
    addExtraInfoItem,
    updateExtraInfoItem,
    removeExtraInfoItem,
  };
}

const initialData = {
  eventName: "",
  poster: {},
  handbook: {},
  description: "",
  location: "",
  locationType: "",
  city: null,
  registrationDateStart: null,
  registrationDateEnd: null,
  eventDateStart: null,
  eventDateEnd: null,
  extraInfos: [],
  isPrivate: null,
};

/* ================================= */

/**
 * Buat `action.type` baru kalau update state-nya bergantung pada data state lainnya.
 * Kalau untuk update field biasa saja, cukup pakai type `FIELD_CHANGE` aja.
 */
function formReducer(state, action) {
  switch (action.type) {
    case "INIT_FORM": {
      if (action.payload) {
        return {
          ...state,
          data: action.payload,
          isEmpty: computeFormIsEmpty(action.payload),
        };
      }
      return { ...state, data: { ...initialData }, isEmpty: true };
    }

    case "FIELD_CHANGE": {
      return {
        ...state,
        data: { ...state.data, [action.field]: action.payload },
      };
    }

    /**
     * Registration Datetime & Event Datetime
     */
    case "REGISTRATION_START": {
      let updatedData = { ...state.data, registrationDateStart: action.payload };
      if (action.payload > state.data.registrationDateEnd || !state.data.registrationDateEnd) {
        updatedData = { ...updatedData, registrationDateEnd: action.payload };
      }

      if (action.payload > state.data.eventDateStart || !state.data.eventDateStart) {
        updatedData = { ...updatedData, eventDateStart: action.payload };
      }

      if (action.payload > state.data.eventDateEnd || !state.data.eventDateEnd) {
        updatedData = { ...updatedData, eventDateEnd: action.payload };
      }

      return { ...state, data: updatedData };
    }

    case "REGISTRATION_END": {
      let updatedData = { ...state.data, registrationDateEnd: action.payload };
      if (action.payload > state.data.eventDateStart || !state.data.eventDateStart) {
        updatedData = { ...updatedData, eventDateStart: action.payload };
      }

      if (action.payload > state.data.eventDateEnd || !state.data.eventDateEnd) {
        updatedData = { ...updatedData, eventDateEnd: action.payload };
      }

      // handle tanggal & jam sebelumnya
      if (action.payload < state.data.registrationDateStart) {
        updatedData = { ...updatedData, registrationDateEnd: state.data.registrationDateStart };
      }

      return { ...state, data: updatedData };
    }

    case "EVENT_START": {
      let updatedData = { ...state.data, eventDateStart: action.payload };
      if (action.payload > state.data.eventDateEnd || !state.data.eventDateEnd) {
        updatedData = { ...updatedData, eventDateEnd: action.payload };
      }

      // handle tanggal & jam sebelumnya
      if (action.payload < setHours(setMinutes(state.data.registrationDateEnd, 0), 0)) {
        updatedData = { ...updatedData, eventDateStart: state.data.registrationDateEnd };
      }
      return { ...state, data: updatedData };
    }

    case "EVENT_END": {
      let updatedData = { ...state.data, eventDateEnd: action.payload };
      // handle tanggal & jam sebelumnya
      if (action.payload < state.data.eventDateStart) {
        updatedData = { ...updatedData, eventDateEnd: state.data.eventDateStart };
      }
      return { ...state, data: updatedData };
    }
    // --- end Registration & Event Datetime

    /**
     * Extra Info
     */
    case "ADD_EXTRA_INFO": {
      const updatedData = {
        ...state.data,
        extraInfos: [...state.data.extraInfos, { key: stringUtil.createRandom(), ...action.value }],
      };
      return { ...state, data: updatedData };
    }

    case "EDIT_EXTRA_INFO": {
      const { key, value } = action;

      const updatedData = {
        ...state.data,
        extraInfos: state.data.extraInfos.map((info) => {
          if (info.key !== key) {
            return info;
          }
          return { ...info, ...value };
        }),
      };

      return { ...state, data: updatedData };
    }

    case "REMOVE_EXTRA_INFO": {
      return {
        ...state,
        data: {
          ...state.data,
          extraInfos: state.data.extraInfos.filter((info) => info.key !== action.key),
        },
      };
    }
    // --- end Extra Info
  }
}

/* ================================= */
// utils

function computeFormIsEmpty(data) {
  return (
    !data?.eventName &&
    !data?.poster?.originalUrl &&
    !data?.location &&
    !data?.locationType &&
    !data?.city?.value &&
    !data?.registrationDateStart &&
    !data?.registrationDateEnd &&
    !data?.eventDateStart &&
    !data?.eventDateEnd
  );
}

export { useFormPublicInfos };
