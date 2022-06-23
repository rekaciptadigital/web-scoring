import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { IdCardService } from "services";

import { toast } from "../components/processing-toast";

import { urlUtil } from "utils";

function useMemberDownload(eventCategoryId, eventId) {
  const fetcher = useFetcher();

  const handleDownloadIdCard = async ({ onSuccess: consumerSuccessHandler, ...options }) => {
    if (!eventCategoryId) {
      return;
    }

    const queryString = { category_id: eventCategoryId, event_id: eventId, type: 1 };

    const getFunction = () => {
      return IdCardService.getDownloadIdCard(queryString);
    };

    const onSuccess = (data) => {
      consumerSuccessHandler?.();
      urlUtil.openUrlOnNewTab(data.fileName);
    };

    fetcher.runAsync(getFunction, { onSuccess, ...options });
  };

  // Hack sementara buat paksa hilangkan toast yang
  // mungkin masih muncul/ketinggalan pas pindah/unmount page
  // TODO: refaktor ke tempat yang lebih proper
  React.useEffect(() => {
    return () => toast.dismiss();
  }, []);

  return { ...fetcher, handleDownloadIdCard };
}

export { useMemberDownload };
