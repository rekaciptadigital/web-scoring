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

  const run = () => {
    dispatch({ type: "RUN", payload: selectedCategories, filter });
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
    const queue = _makeQueue(selectedCategories);
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

function _makeQueue(groups) {
  if (!groups || !Object.keys(groups)?.length) {
    return [];
  }
  const queue = [];
  for (const category in groups) {
    for (const team in groups[category]) {
      const categoryDetail = groups[category][team];
      queue.push({ id: categoryDetail.id, category, team });
    }
  }
  return queue;
}

export { useDisplayController };
