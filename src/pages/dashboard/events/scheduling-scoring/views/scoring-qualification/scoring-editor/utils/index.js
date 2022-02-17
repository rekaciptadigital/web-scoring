// util
function makeSessionStepsFromData(data) {
  if (!data) {
    return [];
  }
  return Object.keys(data).map((groupId, index) => ({
    step: parseInt(groupId),
    label: `Sesi ${index + 1}`,
  }));
}

function sumScoresList(list) {
  const sumReducer = (total, value) => {
    if (!value || (typeof value === "string" && value.toLowerCase() === "m")) {
      return total;
    }
    if (typeof value === "string" && value.toLowerCase() === "x") {
      return total + 10;
    }
    return total + value;
  };
  return list.reduce(sumReducer, 0);
}

function sumEntireTotal(gridData) {
  if (!gridData) {
    return 0;
  }
  const total = Object.keys(gridData).reduce((total, id) => {
    return total + sumScoresList(gridData[id]);
  }, 0);

  return total;
}

export { makeSessionStepsFromData, sumScoresList, sumEntireTotal };
