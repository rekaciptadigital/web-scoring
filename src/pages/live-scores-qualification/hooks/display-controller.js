import * as React from "react";

function useDisplayController(filter, selectedCategories) {
  const [controller, dispatch] = React.useReducer(controllerReducer, {
    queue: [],
    index: -1,
  });

  const isRunning = Boolean(controller.queue?.length);

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }
    const item = controller.queue[controller.index];
    filter.switchCategoryDetail({
      category: item.category,
      team: item.team,
    });
  }, [isRunning, controller.queue, controller.index]);

  const run = (selectedStage) => {
    dispatch({
      type: "RUN",
      filter: filter,
      stage: selectedStage,
      payload: selectedCategories,
    });
  };

  const next = () => {
    dispatch({ type: "GO_NEXT_CATEGORY" });
  };

  return { ...controller, isRunning, run, next };
}

function controllerReducer(state, action) {
  if (action.type === "RUN") {
    const selectedCategories = {};
    for (const category of action.payload) {
      selectedCategories[category] = action.filter.categoryDetails[category];
    }
    const queue = _makeQueue(selectedCategories, action.stage);
    const index = queue.length ? 0 : -1;
    return { queue, index };
  }

  if (action.type === "GO_NEXT_CATEGORY") {
    const nextIndex = state.index + 1;
    const total = state.queue.length;
    const targetIndex = nextIndex >= total ? 0 : nextIndex;
    return { ...state, index: targetIndex };
  }

  return state;
}

function _makeQueue(groups, stage) {
  if (!groups || !Object.keys(groups)?.length) {
    return [];
  }
  const queue = [];
  const isElimination = stage === "elimination";
  for (const category in groups) {
    for (const team in groups[category]) {
      const categoryDetail = groups[category][team];
      if (isElimination && !categoryDetail.eliminationLock) {
        // Hanya antrikan kategori di eliminasi yang
        // udah ditentukan bagannya aja. Yang belum, skip.
        continue;
      }
      const item = { id: categoryDetail.id, category, team, stage };
      queue.push(item);
    }
  }
  return queue;
}

export { useDisplayController };
