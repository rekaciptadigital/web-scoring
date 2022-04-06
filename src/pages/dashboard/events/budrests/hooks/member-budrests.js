import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useMemberBudrests(eventId, date) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId || !date) {
      return;
    }
    const getFunction = () => {
      return BudRestService.getMembersBudrestByDate({ event_id: eventId, date: date });
    };
    fetcher.runAsync(getFunction, { transform });
  }, [eventId, date]);

  return { ...fetcher };
}

function transform(originalData) {
  const categoryIds = Object.keys(originalData.categoryBudrest);
  const groupsData = categoryIds.map((groupId) => ({
    id: parseInt(groupId),
    label: originalData.categoryBudrest[groupId][0].labelCategory,
  }));

  return {
    date: originalData.date,
    groups: groupsData,
    budrestsByCategory: originalData.categoryBudrest,
  };
}

export { useMemberBudrests };
