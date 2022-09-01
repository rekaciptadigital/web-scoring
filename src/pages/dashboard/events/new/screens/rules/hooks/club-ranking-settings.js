import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useClubRankingSetting(eventId) {
  const fetcher = useFetcher();

  const fetchRankingSetting = () => {
    const getFunction = () => EventsService.getClubRankingSetting({ eventId });
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchRankingSetting();
  }, [eventId]);

  return { ...fetcher, fetchRankingSetting };
}

export { useClubRankingSetting };
