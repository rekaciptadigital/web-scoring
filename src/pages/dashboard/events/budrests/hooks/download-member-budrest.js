import { useFetcher } from "utils/hooks/alt-fetcher";
import { useRouteQueryParams } from "./route-params";
import { BudRestService } from "services";

import { urlUtil } from "utils";

function useDownloadMemberBudrests() {
  const { eventId, date } = useRouteQueryParams();
  const fetcher = useFetcher();

  const download = ({ onSuccess, ...options }) => {
    const getFunction = () => {
      return BudRestService.getDownloadMembersBudrestByDate({
        event_id: eventId,
        date: date,
      });
    };
    const customOptions = {
      ...options,
      onSuccess: (data) => {
        onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data);
      },
    };
    fetcher.runAsync(getFunction, customOptions);
  };

  return { ...fetcher, download };
}

export { useDownloadMemberBudrests };
