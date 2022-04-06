import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

import { computeRowSpan } from "../utils";

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
  // Ini bisa dihilangkan kalau di backend juga udah ilang
  if (typeof originalData.categoryBudrest.totalTargetFace !== "undefined") {
    delete originalData.categoryBudrest.totalTargetFace;
  }
  const categoryIds = Object.keys(originalData.categoryBudrest);
  const groupsData = categoryIds.map((groupId) => ({
    id: parseInt(groupId),
    label: originalData.categoryBudrest[groupId][0].labelCategory,
  }));

  const dataWithRowSpan = computeRowSpan(originalData.categoryBudrest);

  return {
    date: originalData.date,
    groups: groupsData,
    budrestsByCategory: dataWithRowSpan,
  };
}

export { useMemberBudrests };
