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

export { sumScoresList };
