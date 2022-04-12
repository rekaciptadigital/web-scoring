function getNumberFromBudrest(budrestNumber) {
  const chars = [...budrestNumber];
  const extracted = chars.filter((char, index) => index < chars.length - 1).join("");
  return Number(extracted);
}

function computeRowSpanAndClub(initialBudrestsByCategory) {
  const budrestsByCategory = { ...initialBudrestsByCategory };

  const categoryIds = Object.keys(budrestsByCategory);
  const dataWithRowSpan = {};

  for (const id of categoryIds) {
    const rows = [...budrestsByCategory[id]];
    const counterSameBudrest = countSameBudrests(rows);
    const budrestGroupIndexes = Object.keys(counterSameBudrest);

    // Assign jumlah row span untuk bantalan yang sama
    for (const index of budrestGroupIndexes) {
      rows[index] = {
        ...rows[index],
        rowSpan: counterSameBudrest[index],
      };
    }

    budrestGroupIndexes.forEach((rowIndex) => {
      const startIndex = parseInt(rowIndex);
      const rowsCount = parseInt(counterSameBudrest[rowIndex]);
      const endIndex = startIndex + rowsCount;
      const duplicateClubNames = findDuplicateClubNames(rows, startIndex, endIndex);

      // Assign flag `hasSameClub` ke row yang klubnya sama dalam satu bantalan
      for (let i = startIndex; i < endIndex; i++) {
        const checkClubName = rows[i].clubName;
        const hasDuplicate = duplicateClubNames.indexOf(checkClubName) >= 0;
        if (!hasDuplicate) {
          continue;
        }
        rows[i] = { ...rows[i], hasSameClub: true };
      }
    });

    dataWithRowSpan[id] = rows;
  }

  return dataWithRowSpan;
}

const countSameBudrests = (rows) => {
  const counterSameBudrest = {};
  let prevNumber = null;
  let prevIndex = null;

  rows.forEach((row, index) => {
    const currentNumber = getNumberFromBudrest(row.budRestNumber);

    if (currentNumber !== prevNumber) {
      prevNumber = currentNumber;
      prevIndex = index;
    }

    counterSameBudrest[prevIndex] = counterSameBudrest[prevIndex]
      ? counterSameBudrest[prevIndex] + 1
      : 1;
  });

  return counterSameBudrest;
};

function findDuplicateClubNames(rows, startIndex, maxLoop) {
  const counterSameClub = {};

  for (let i = startIndex; i < maxLoop; i++) {
    const row = rows[i];
    if (!row.budRestNumber) {
      // Yang gak punya nomor bantalan gak perlu
      // ditandai klub yang sama dalam satu bantalan
      continue;
    }
    counterSameClub[row.clubName] = counterSameClub[row.clubName]
      ? counterSameClub[row.clubName] + 1
      : 1;
  }

  const duplicateClubNames = Object.keys(counterSameClub).filter(
    (clubName) => counterSameClub[clubName] > 1
  );

  return duplicateClubNames;
}

export { computeRowSpanAndClub, getNumberFromBudrest };
