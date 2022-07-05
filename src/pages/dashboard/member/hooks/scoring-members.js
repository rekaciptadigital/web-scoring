import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useScoringMembers({ categoryDetailId, inputSearchQuery, eventId }) {
  const fetcher = useFetcher();
  const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return EventsService.getEventMemberNew({
        event_category_id: categoryDetailId,
        // TODO: pakai buat search? sementara gak dikirim dulu
        // name: debouncedSearchQuery || undefined,
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
  }, [categoryDetailId, debouncedSearchQuery]);

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
