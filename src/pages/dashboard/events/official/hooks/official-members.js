import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { OfficialService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useOfficialMembers(eventId, inputSearchQuery) {
    const fetcher = useFetcher();
    const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");


    const fetchOfficialMembers = () => {
        const getFunction = () => {
          return OfficialService.get({
              event_id: eventId,
              userName: debouncedSearchQuery || undefined,
          });
        };
        fetcher.runAsync(getFunction);
      };

  React.useEffect(() => {
    fetchOfficialMembers();
  }, [eventId, debouncedSearchQuery]);

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
    fetchOfficialMembers,
  };
    
}

export { useOfficialMembers };