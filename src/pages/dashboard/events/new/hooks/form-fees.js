import * as React from "react";
import { makeStateFees } from "../utils/event-fees";

function useFormFees(eventDetail) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    dispatch({
      type: "INIT_FORM",
      payload: eventDetail?.eventCategories?.length ? eventDetail?.eventCategories : undefined,
    });
  }, [eventDetail]);

  const updateField = (fieldName, value) => {
    dispatch({
      type: "FIELD_CHANGE",
      field: fieldName,
      payload: value,
    });
  };

  const markAsFilled = () => dispatch({ type: "SET_AS_FILLED" });

  const updateRegistrationFee = (value) => {
    dispatch({ type: "SET_REGISTRATION_FEE", payload: value });
  };
  const updateEarlyBirdFee = (value) => {
    dispatch({ type: "SET_EARLY_BIRD_FEE", payload: value });
  };
  const toggleEarlyBird = () => dispatch({ type: "TOGGLE_EARLY_BIRD" });
  const toggleFeeIsFlat = () => dispatch({ type: "TOGGLE_FLAT_FEE" });

  const activateTeamFee = (type, team) => {
    const actionTypes = {
      normal: "TOGGLE_ACTIVE_TEAM",
      earlyBird: "TOGGLE_ACTIVE_TEAM_EARLY_BIRD",
    };
    dispatch({
      type: actionTypes[type],
      feeType: type,
      team: team,
    });
  };

  const checkIsTeamActive = (teamName) => {
    if (!state.data) {
      return true;
    }
    if (!teamName) {
      return false;
    }
    const indexByField = _getIndexByField(state.data.feesByTeam);
    const fieldIndex = indexByField[teamName];
    return state.data.feesByTeam[fieldIndex].isActive;
  };

  const updateTeamFee = (team, value) => {
    dispatch({ type: "TEAM_FEE_CHANGE", team: team, payload: value });
  };

  const updateTeamEarlyBirdFee = (team, value) => {
    dispatch({ type: "TEAM_FEE_CHANGE_EARLY_BIRD", team: team, payload: value });
  };

  const getTeamLabel = (team) => {
    const labels = {
      individu: "Individu",
      individu_mix: "Individu (Campuran)",
      team: "Beregu",
      mix: "Beregu Campuran",
    };
    return labels[team];
  };

  return {
    ...state,
    markAsFilled,
    updateField,
    updateRegistrationFee,
    updateEarlyBirdFee,
    toggleFeeIsFlat,
    toggleEarlyBird,
    activateTeamFee,
    checkIsTeamActive,
    updateTeamFee,
    updateTeamEarlyBirdFee,
    getTeamLabel,
  };
}

function formReducer(state, action) {
  switch (action.type) {
    case "INIT_FORM": {
      /**
       * payload-nya `eventCategories`
       */
      if (!action.payload) {
        return { ...state, data: makeDefaultFeeData(), isEmpty: true };
      }
      return {
        ...state,
        data: makeStateFees(action.payload),
        isEmpty: computeFormIsEmpty(action.payload),
      };
    }

    case "FIELD_CHANGE": {
      return {
        ...state,
        data: { ...state.data, [action.field]: action.payload },
      };
    }

    case "SET_AS_FILLED": {
      return { ...state, isEmpty: false };
    }

    case "SET_REGISTRATION_FEE": {
      if (!action.payload) {
        // Kembali ke keadaan awal kosongan agar bisa
        // diterjemahkan sebagai "gratis"
        return {
          ...state,
          data: {
            ...state.data,
            registrationFee: 0,
            isFlatFee: true,
            isEarlyBird: false,
            earlyBirdFee: 0,
            earlyBirdEndDate: null,
            feesByTeam: state.data.feesByTeam.map((feeItem) => ({
              ...feeItem,
              isActive: true,
              amount: 0,
            })),
            earlyBirdByTeam: state.data.earlyBirdByTeam.map((feeItem) => ({
              ...feeItem,
              isActive: false,
              amount: 0,
            })),
          },
        };
      }

      return {
        ...state,
        data: {
          ...state.data,
          registrationFee: action.payload,
          feesByTeam: state.data.feesByTeam.map((teamFeeItem) => ({
            ...teamFeeItem,
            isActive: !state.data.registrationFee ? true : teamFeeItem.isActive,
            amount: action.payload,
          })),
        },
      };
    }

    case "SET_EARLY_BIRD_FEE": {
      return {
        ...state,
        data: {
          ...state.data,
          earlyBirdFee: action.payload,
          earlyBirdByTeam: state.data.earlyBirdByTeam.map((teamFeeItem) => ({
            ...teamFeeItem,
            amount: action.payload,
          })),
        },
      };
    }

    case "TOGGLE_EARLY_BIRD": {
      const syncToggledActive = !state.data.isEarlyBird;
      return {
        ...state,
        data: {
          ...state.data,
          isEarlyBird: !state.data.isEarlyBird,
          earlyBirdByTeam: syncToEarlyBirdToggle(state.data, syncToggledActive),
        },
      };
    }

    case "TOGGLE_FLAT_FEE": {
      const data = state.data;
      return {
        ...state,
        data: {
          ...data,
          isFlatFee: !data.isFlatFee,
          feesByTeam: data.feesByTeam.map((teamFee) => ({
            ...teamFee,
            isActive: true,
            amount: data.registrationFee,
          })),
          earlyBirdByTeam: data.earlyBirdByTeam.map((teamFee) => ({
            ...teamFee,
            isActive: data.isEarlyBird,
            amount: data.earlyBirdFee,
          })),
        },
      };
    }

    case "TOGGLE_ACTIVE_TEAM": {
      let toggledActive; // untuk sinkronkan "pasangan" early bird-nya
      return {
        ...state,
        data: {
          ...state.data,

          feesByTeam: state.data.feesByTeam.map((feeItem) => {
            if (feeItem.team !== action.team) {
              return feeItem;
            }
            toggledActive = !feeItem.isActive;
            return {
              ...feeItem,
              isActive: toggledActive,
            };
          }),

          earlyBirdByTeam: syncEarlyBirdToNormalFees(
            state.data,
            action.feeType,
            action.team,
            toggledActive
          ),
        },
      };
    }

    case "TOGGLE_ACTIVE_TEAM_EARLY_BIRD": {
      return {
        ...state,
        data: {
          ...state.data,
          earlyBirdByTeam: state.data.earlyBirdByTeam.map((feeItem) => {
            if (feeItem.team !== action.team) {
              return feeItem;
            }
            return {
              ...feeItem,
              isActive: !feeItem.isActive,
            };
          }),
        },
      };
    }

    case "TEAM_FEE_CHANGE": {
      return {
        ...state,
        data: {
          ...state.data,
          feesByTeam: state.data.feesByTeam.map((feeItem) => {
            if (feeItem.team !== action.team) {
              return feeItem;
            }
            return {
              ...feeItem,
              amount: action.payload,
            };
          }),
        },
      };
    }

    case "TEAM_FEE_CHANGE_EARLY_BIRD": {
      return {
        ...state,
        data: {
          ...state.data,
          earlyBirdByTeam: state.data.earlyBirdByTeam.map((feeItem) => {
            if (feeItem.team !== action.team) {
              return feeItem;
            }
            return {
              ...feeItem,
              amount: action.payload,
            };
          }),
        },
      };
    }
  }
}

/* ================================================== */
// utils

function syncToEarlyBirdToggle(data, syncToggledActive) {
  return data.earlyBirdByTeam.map((teamFee, index) => {
    if (!data.feesByTeam[index].isActive) {
      return teamFee;
    }
    return {
      ...teamFee,
      isActive: syncToggledActive,
    };
  });
}

function syncEarlyBirdToNormalFees(data, feeType, team, toggledActive) {
  if (!(feeType === "normal" && data.isEarlyBird)) {
    return data.earlyBirdByTeam;
  }

  return data.earlyBirdByTeam.map((feeItem) => {
    if (feeItem.team !== team) {
      return feeItem;
    }
    return {
      ...feeItem,
      isActive: toggledActive,
    };
  });
}

const makeDefaultFeeData = () => ({
  registrationFee: "", // Pakai string kosong untuk dirender di input
  isEarlyBird: false,
  earlyBirdEndDate: null,
  earlyBirdFee: "",
  includePaymentGatewayFeeToUser: 0,
  isFlatFee: true,
  feesByTeam: makeDefaultFeesByTeam(),
  earlyBirdByTeam: makeDefaultEarlyBirdByTeam(),
});

const makeDefaultFeesByTeam = () => [
  { team: "individu", isActive: true, amount: "" },
  { team: "individu_mix", isActive: false, amount: "" },
  { team: "team", isActive: true, amount: "" },
  { team: "mix", isActive: true, amount: "" },
];

const makeDefaultEarlyBirdByTeam = () => [
  { team: "individu", isActive: false, amount: "" },
  { team: "individu_mix", isActive: false, amount: "" },
  { team: "team", isActive: false, amount: "" },
  { team: "mix", isActive: false, amount: "" },
];

/* ========================================== */
// util

function computeFormIsEmpty(data) {
  return !data?.length;
}

function _getIndexByField(feesByTeam) {
  const indexByField = {};
  for (const index in feesByTeam) {
    const fee = feesByTeam[index];
    indexByField[fee.team] = parseInt(index);
  }
  return indexByField;
}

export { useFormFees };
