import * as React from "react";

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

function rowsAfterFilter(originalRows, searchKeyword) {
  if (!searchKeyword) {
    return originalRows;
  }

  const filteredList = originalRows.filter((memberBudrest) => {
    const archerName = memberBudrest.name.toLowerCase();
    const keyword = searchKeyword.trim().toLowerCase();
    const foundIndex = archerName.indexOf(keyword);
    return foundIndex >= 0;
  });
  return filteredList;
}

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
    budrestsByCategory: filteredData,
  };
}

export { useSearchMemberBudrests };
