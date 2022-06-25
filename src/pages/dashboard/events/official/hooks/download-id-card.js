import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { IdCardService } from "services";

import { toast } from "../components/processing-toast";

import { urlUtil } from "utils";

function useDownloadIdCard(eventId) {
  const fetcher = useFetcher();

  const download = async ({ onSuccess, ...options }) => {
    const getFunction = () => {
      return IdCardService.getDownloadIdCard({
        event_id: eventId,
        type: 2,
      });
    };

    const customOptions = {
      ...options,
      onSuccess: (data) => {
        onSuccess?.();
        urlUtil.openUrlOnNewTab(data.fileName);
      },
    };

    fetcher.runAsync(getFunction, customOptions);
  };

  // Hack sementara buat paksa hilangkan toast yang
  // mungkin masih muncul/ketinggalan pas pindah/unmount page
  // TODO: refaktor ke tempat yang lebih proper
  React.useEffect(() => {
    return () => toast.dismiss();
  }, []);

  return { ...fetcher, download };
}

export { useDownloadIdCard };
