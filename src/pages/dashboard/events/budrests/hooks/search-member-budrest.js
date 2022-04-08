import * as React from "react";

import { computeRowSpan } from "../utils";

function useSearchMemberBudrests(initialMemberBudrests) {
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [searchResults, setResults] = React.useState(initialMemberBudrests);

  React.useEffect(() => {
    // Perlu debounce kayak gini karena total item datanya bisa banyak
    // dan komponennya yang dirender berat-berat (kayak `react-select`, misalnya)
    const delayTimer = setTimeout(() => {
      const filteredResult = filterMemberBudrestsData(initialMemberBudrests, searchKeyword);
      setResults(filteredResult);
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [initialMemberBudrests, searchKeyword]);

  return {
    searchResults,
    searchKeyword,
    setSearchKeyword,
  };
}

/* ========================= */
// utils

function filterMemberBudrestsData(originalMemberBudrests, searchKeyword) {
  if (!originalMemberBudrests || !searchKeyword) {
    return originalMemberBudrests;
  }

  const filteredGroups = [];
  const filteredData = {};

  for (const group of originalMemberBudrests.groups) {
    const originalList = originalMemberBudrests.budrestsByCategory[group.id];
    const filteredRows = rowsAfterFilter(originalList, searchKeyword);

    if (!filteredRows.length) {
      continue;
    }

    filteredData[group.id] = filteredRows;
    filteredGroups.push(group);
  }

  return {
    ...originalMemberBudrests,
    groups: filteredGroups,
    budrestsByCategory: computeRowSpan(filteredData),
  };
}

function rowsAfterFilter(originalRows, searchKeyword) {
  if (!searchKeyword) {
    return originalRows;
  }

  const filteredList = originalRows.filter((memberBudrest) => {
    const archerName = memberBudrest.name.toLowerCase();
    const clubName = memberBudrest.clubName.toLowerCase();
    const keyword = searchKeyword.trim().toLowerCase();

    const foundIndexOnArcher = archerName.indexOf(keyword);
    const foundIndexOnClub = clubName.indexOf(keyword);

    return foundIndexOnArcher >= 0 || foundIndexOnClub >= 0;
  });
  return filteredList;
}

export { useSearchMemberBudrests };
