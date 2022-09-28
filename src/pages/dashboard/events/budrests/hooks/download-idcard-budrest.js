import { useFetcher } from "hooks/alt-fetcher";
import { BudRestService } from "services";

import { urlUtil } from "utils";

function useIdcardDownloadBudrest(event_id) {
  const fetcher = useFetcher();

  const download = async (date, type ,customOptions) => {
    if (!date) {
      return;
    }

    const getFunction = () => {

      if(type == 'category'){
        return BudRestService.getDownloadIDCardByCategory({
          event_id: event_id,
          date: date
        });
      }

      if(type == 'budrest'){
        return BudRestService.getDownloadIDCardByBudrest({
          event_id: event_id,
          date: date
        });
      }

      if(type == 'club'){
        return BudRestService.getDownloadIDCardByClub({
          event_id: event_id,
          date: date
        });
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
