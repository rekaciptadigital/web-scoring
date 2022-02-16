function makeOptionsFromData(data) {
  if (!data) {
    return [];
  }

  const options = data.map((detail) => {
    const labelText = [
      detail.competitionCategory,
      detail.ageCategory,
      detail.distancesCategory,
    ].join(" - ");
    return { value: detail.eventCategoryDetailsId, label: labelText };
  });
  return options || [];
}

export { makeOptionsFromData };
