import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

import { stringUtil } from "utils";
import { computeRowSpanAndClub } from "../utils";

function useMemberBudrests(eventId, date) {
  const fetcher = useFetcher();

  const fetchMemberBudrests = React.useCallback(() => {
    const getFunction = () => {
      return BudRestService.getMembersBudrestByDate({ event_id: eventId, date: date });
    };
    fetcher.runAsync(getFunction, { transform });
  }, [eventId, date]);

  React.useEffect(() => {
    if (!eventId || !date) {
      return;
    }
    fetchMemberBudrests();
  }, [eventId, date]);

  return { ...fetcher, fetchMemberBudrests };
}

function transform(originalData) {
  const categoryIds = Object.keys(originalData.categoryBudrest);
  const groupsData = categoryIds.map((groupId) => ({
    id: parseInt(groupId),
    label: originalData.categoryBudrest[groupId][0].labelCategory,
  }));

  const dataWithRowSpan = computeRowSpanAndClub(originalData.categoryBudrest);

  // assign key untuk render "list"
  for (const id of categoryIds) {
    const rowsData = dataWithRowSpan[id];
    dataWithRowSpan[id] = rowsData.map((row) => ({ ...row, key: stringUtil.createRandom() }));
  }

  return {
    date: originalData.date,
    groups: groupsData,
    budrestsByCategory: dataWithRowSpan,
  };
}

export { useMemberBudrests };
