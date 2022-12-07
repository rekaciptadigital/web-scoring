import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useShootRuleSetting(event_id) {
  const fetcher = useFetcher();

  const fetchRuleShootSetting = () => {
    const getFunction = () => EventsService.getShootRuleSetting({ event_id });
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!event_id) {
      return;
    }
    fetchRuleShootSetting();
  }, [event_id]);

  return { ...fetcher, fetchRuleShootSetting };
}

export { useShootRuleSetting };