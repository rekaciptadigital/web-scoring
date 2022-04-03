import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useQualificationSchedules(eventDetail) {
  const fetcher = useFetcher();
  const { data } = fetcher;
  const categoryCounts = eventDetail?.eventCategories?.length;

  const fetchSchedules = () => {
    const getFunction = () => {
      const qs = { event_id: eventDetail?.id, type: "Individual" };
      return EventsService.getEventQualificationSchedules(qs);
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    // Ambil data jadwal kualifikasi hanya ketika
    // data kategori sudah terbuat dan ketika dipanggil
    // lewat event handler...
    if (!categoryCounts || data) {
      return;
    }
    fetchSchedules();
  }, [categoryCounts, data]);

  return { ...fetcher, fetchSchedules };
}

export { useQualificationSchedules };
