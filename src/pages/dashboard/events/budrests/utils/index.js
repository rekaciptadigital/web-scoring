function getNumberFromBudrest(budrestNumber) {
  const chars = [...budrestNumber];
  const extracted = chars.filter((char, index) => index < chars.length - 1).join("");
  return Number(extracted);
}

function computeRowSpan(initialBudrestsByCategory) {
  const budrestsByCategory = { ...initialBudrestsByCategory };

  const categoryIds = Object.keys(budrestsByCategory);
  const dataWithRowSpan = {};

  for (const id of categoryIds) {
    const dataByCategory = [...budrestsByCategory[id]];
    const counter = {};
    let prevNumber = null;
    let prevIndex = null;

    dataByCategory.forEach((item, index) => {
      const number = getNumberFromBudrest(item.budRestNumber);
      if (number !== prevNumber) {
        prevNumber = number;
        prevIndex = index;
      }
      counter[prevIndex] = counter[prevIndex] ? counter[prevIndex] + 1 : 1;
    });

    Object.keys(counter).forEach((counterIndex) => {
      dataByCategory[counterIndex] = {
        ...dataByCategory[counterIndex],
        rowSpan: counter[counterIndex],
      };
    });

    dataWithRowSpan[id] = dataByCategory;
  }

  return dataWithRowSpan;
}

export { computeRowSpan, getNumberFromBudrest };
