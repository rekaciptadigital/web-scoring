import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useScoringMembers(categoryDetailId, inputSearchQuery, eliminationParticipantsCount, eventId) {
  const fetcher = useFetcher();
  const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return EventsService.getEventMemberNew({
        event_category_id: categoryDetailId,
        name: debouncedSearchQuery || undefined,
        elimination_template: eliminationParticipantsCount,
        event_id: eventId,
        is_pagination: 1,
      });
    };
    fetcher.runAsync(getFunction, { transform });
  };

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    fetchScoringMembers();
  }, [categoryDetailId, eliminationParticipantsCount, debouncedSearchQuery]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedInputSearchQuery(inputSearchQuery);
    }, DEBOUNCE_TIMER_MS);
    return () => clearTimeout(debounceTimer);
  }, [inputSearchQuery]);

  const searchQuery = debouncedSearchQuery;

  return {
    ...fetcher,
    searchQuery,
    fetchScoringMembers,
  };
}

function transform(initialScoringMembers) {
  return initialScoringMembers?.map((row) => ({
    ...row,
    member: {
      ...row,
    },
  }));
}

export { useScoringMembers };
