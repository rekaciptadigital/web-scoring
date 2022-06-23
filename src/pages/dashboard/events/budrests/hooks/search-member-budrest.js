import * as React from "react";

import { computeRowSpanAndClub } from "../utils";

function useSearchMemberBudrests(memberBudrests) {
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [searchResults, setResults] = React.useState(null);

  React.useEffect(() => {
    if (!searchKeyword) {
      setResults(memberBudrests);
      return;
    }

    // Perlu debounce kayak gini karena total item datanya bisa banyak
    // dan komponennya yang dirender berat-berat (kayak `react-select`, misalnya)
    const delayTimer = setTimeout(() => {
      const filteredResult = filterMemberBudrestsData(memberBudrests, searchKeyword);
      setResults(filteredResult);
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [memberBudrests, searchKeyword]);

  return {
    // Fallback ke data awal kalau belum ada search karena ada delay debounce
    // waktu update data, bisa crash.
    searchResults: searchResults || memberBudrests,
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
    budrestsByCategory: computeRowSpanAndClub(filteredData),
  };
}

function rowsAfterFilter(originalRows, searchKeyword) {
  if (!searchKeyword) {
    return originalRows;
  }
  /**
   * Cocokkan kata kunci dari search box dengan:
   * 1. nama peserta
   * 2. opsional: nama klub, kalau "ada" klubnya
   */
  const filteredList = originalRows.filter((memberBudrest) => {
    const archerName = memberBudrest.name.toLowerCase();
    const clubName = memberBudrest.clubName?.toLowerCase() || ""; // ada kemungkinan peserta "gak punya" klub
    const keyword = searchKeyword.trim().toLowerCase();

    if (!clubName) {
      // skip mencocokkan di nama klub
      const foundIndexOnArcher = archerName.indexOf(keyword);
      return foundIndexOnArcher >= 0;
    }

    const foundIndexOnArcher = archerName.indexOf(keyword);
    const foundIndexOnClub = clubName.indexOf(keyword);
    return foundIndexOnArcher >= 0 || foundIndexOnClub >= 0;
  });

  return filteredList;
}

export { useSearchMemberBudrests };
