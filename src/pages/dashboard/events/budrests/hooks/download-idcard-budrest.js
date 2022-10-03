import { useFetcher } from "hooks/alt-fetcher";
import { BudRestService } from "services";

import { urlUtil } from "utils";

function useIdcardDownloadBudrest(event_id) {
  const fetcher = useFetcher();

  const download = async (date, type, customOptions) => {
    let param = null;

    if (!date) {
      param = {
        event_id: event_id,
      };
    } else {
      param = {
        event_id: event_id,
        date: date,
      };
    }

    const getFunction = () => {
      if (type == "category") {
        return BudRestService.getDownloadIDCardByCategory(param);
      }

      if (type == "budrest") {
        return BudRestService.getDownloadIDCardByBudrest(param);
      }

      if (type == "club") {
        return BudRestService.getDownloadIDCardByClub(param);
      }
    };

    const options = {
      ...customOptions,
      onSuccess: (data) => {
        customOptions.onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data.fileName);
      },
    };
    fetcher.runAsync(getFunction, options);
  };

  return { ...fetcher, download };
}

export { useIdcardDownloadBudrest };
