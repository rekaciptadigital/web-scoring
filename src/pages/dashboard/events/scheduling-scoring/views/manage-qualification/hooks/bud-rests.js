import * as React from "react";
import { BudRestService } from "services";

// eslint-disable-next-line no-unused-vars
import { parseISO, isBefore } from "date-fns";

function makeBudRestsState(data) {
  const groupNames = data ? Object.keys(data) : [];
  const transformedData = {};
  for (const groupName in data) {
    transformedData[groupName] = data[groupName].map((categoryDetail) => ({
      categoryDetailId: categoryDetail.id,
      age: categoryDetail.ageCategoryDetail.label,
      competition: categoryDetail.competitionCategoryDetail.label,
      distance: categoryDetail.distanceDetail.label,
      team: categoryDetail.categoryTeam.label,
      totalParticipants: categoryDetail.totalParticipant,
      qualificationTimeStart: categoryDetail.qualificationStart || "",
      budRest: categoryDetail.budRest
        ? {
            id: categoryDetail.budRest.id,
            categoryDetailId: categoryDetail.budRest.archeryEventCategoryId,
            start: categoryDetail.budRest.budRestStart,
            end: categoryDetail.budRest.budRestEnd,
            targetFace: categoryDetail.budRest.targetFace,
          }
        : null,
    }));
  }

  return { data: transformedData, groupNames };
}

function budRestsReducer(state, action) {
  if (action.type === "INIT") {
    const { data, groupNames } = makeBudRestsState(action.data);
    return { ...state, status: "success", data, groupNames };
  }
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  return { ...state, ...action };
}

function useEventBudRests(eventId) {
  const [budRests, dispatch] = React.useReducer(budRestsReducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });

  const { attempts } = budRests;

  React.useEffect(() => {
    const fetchBudRests = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await BudRestService.getByEventId({ event_id: eventId });
      if (result.success) {
        dispatch({ type: "INIT", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.errors });
      }
    };

    fetchBudRests();
  }, [attempts]);

  const refetch = () => dispatch({ type: "REFETCH" });

  return { ...budRests, state: budRests, dispatch, refetch };
}

const makeDefaultTargetFace = () => ({ value: 4, label: 4 });

function shouldRecommendDefaults(data) {
  const hasNoBudRest = (categoryDetail) => !categoryDetail.budRest;
  return Boolean(data?.every(hasNoBudRest));
}

function shouldAllowEditBudRest(qualificationTimeStart, today, totalParticipants) {
  // eslint-disable-next-line no-unused-vars
  const qualificationStart =
    typeof qualificationTimeStart === "string"
      ? parseISO(qualificationTimeStart)
      : qualificationTimeStart;
  // TODO: perbaiki validasi tanggal lomba
  // return true || (isBefore(today, qualificationStart) && totalParticipants > 0);
  return totalParticipants > 0;
}

function makeFormState(budRestsData) {
  const transformedState = {};
  for (const groupName in budRestsData) {
    const shouldRecommend = shouldRecommendDefaults(budRestsData[groupName]);

    transformedState[groupName] = {};
    transformedState[groupName].common = { targetFace: makeDefaultTargetFace() };

    // Atur rekomendasi nilai inputan default
    // Dijalankan hanya ketika kelompok kategori belum ada data bantalannya sama sekali
    if (shouldRecommend) {
      let previousId = -1;
      const { value: defaultTargetFaceNumber } = transformedState[groupName].common.targetFace;

      budRestsData[groupName].forEach((categoryDetail) => {
        const computedStartNumber = (transformedState[groupName][previousId]?.end || 0) + 1;
        const computedRange = Math.ceil(categoryDetail.totalParticipants / defaultTargetFaceNumber);

        transformedState[groupName][categoryDetail.categoryDetailId] = {
          categoryDetailId: categoryDetail.categoryDetailId,
          start: computedStartNumber,
          end: computedStartNumber - 1 + computedRange || 1,
          targetFace: makeDefaultTargetFace(),
          totalParticipants: categoryDetail.totalParticipants,
          isEditAllowed: shouldAllowEditBudRest(
            categoryDetail.qualificationTimeStart,
            new Date(),
            categoryDetail.totalParticipants
          ),
        };

        previousId = categoryDetail.categoryDetailId;
      });

      continue;
    }

    budRestsData[groupName].forEach((categoryDetail) => {
      const isEditAllowed = shouldAllowEditBudRest(
        categoryDetail.qualificationTimeStart,
        new Date(),
        categoryDetail.totalParticipants
      );

      if (!categoryDetail.budRest) {
        transformedState[groupName][categoryDetail.categoryDetailId] = {
          categoryDetailId: categoryDetail.categoryDetailId,
          start: "",
          end: "",
          targetFace: makeDefaultTargetFace(),
          totalParticipants: categoryDetail.totalParticipants,
          isEditAllowed: isEditAllowed,
        };
      } else {
        transformedState[groupName][categoryDetail.categoryDetailId] = {
          ...categoryDetail.budRest,
          targetFace: {
            value: categoryDetail.budRest.targetFace,
            label: categoryDetail.budRest.targetFace,
          },
          totalParticipants: categoryDetail.totalParticipants,
          isEditAllowed: isEditAllowed,
        };
      }
    });
  }
  return transformedState;
}

function budRestsFormReducer(state, action) {
  if (action.type === "INIT") {
    const transformedState = makeFormState(action.data);
    return { ...state, data: transformedState };
  }

  if (action.type === "CHANGE_COMMON") {
    const nextGroupData = { ...state.data[action.groupName] };

    for (const id in nextGroupData) {
      const previousData = nextGroupData[id];
      if (id !== "common" && !previousData.isEditAllowed) {
        continue;
      }
      nextGroupData[id] = { ...previousData, targetFace: action.payload };
    }

    return {
      ...state,
      data: {
        ...state.data,
        [action.groupName]: nextGroupData,
      },
    };
  }

  if (action.type === "INVALID") {
    return { ...state, errors: action.errors };
  }

  if (action.group && action.categoryDetailId) {
    const nextGroupState = { ...state.data[action.group] };
    const originalState = nextGroupState[action.categoryDetailId];
    nextGroupState[action.categoryDetailId] = { ...originalState, ...action.payload };

    return {
      ...state,
      data: {
        ...state.data,
        [action.group]: nextGroupState,
      },
    };
  }

  return state;
}

function useBudRestsForm(budRests) {
  const [form, dispatch] = React.useReducer(budRestsFormReducer, {
    status: "idle",
    data: null,
    errors: null,
  });

  React.useEffect(() => {
    if (!budRests) {
      return;
    }
    dispatch({ type: "INIT", data: budRests });
  }, [budRests]);

  return { ...form, state: form, dispatch };
}

export { useEventBudRests, useBudRestsForm };
