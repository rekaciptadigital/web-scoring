import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useFaceTargetSetting(eventId) {
  const fetcher = useFetcher();

  const fetchTargetFaceSetting = () => {
    const getFunction = () => EventsService.getTargetFaceSetting({ eventId });
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchTargetFaceSetting();
  }, [eventId]);

  return { ...fetcher, fetchTargetFaceSetting };
}

export { useFaceTargetSetting };
