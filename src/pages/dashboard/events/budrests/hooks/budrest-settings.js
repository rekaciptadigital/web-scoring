import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

import { parseISO } from "date-fns";
import { stringUtil } from "utils";

function useBudrestSettings(eventId) {
  /**
   * Data response di sini mengikuti data jadwal kualifikasi yang sudah diset di event.
   * Minimal pasti udah ada data sejumlah data jadwal. Yang bisa jadi belum ada datanya
   * ada di properti `budRest` (lihat response API GET-nya), `null` kalau gak ada data.
   */
  const fetcher = useFetcher();

  const fetchBudrestSettings = () => {
    const getFunction = () => BudRestService.getSettingsByEventId({ event_id: eventId });
    fetcher.runAsync(getFunction, { transform });
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchBudrestSettings();
  }, [eventId]);

  return { ...fetcher, fetchBudrestSettings };
}

function transform(originalData) {
  const dataGroupByDate = {};

  for (const setting of originalData) {
    const date = setting.detailCategory.eventStart.split(" ")[0];
    if (!dataGroupByDate[date]) {
      dataGroupByDate[date] = {
        key: stringUtil.createRandom(),
        date: parseISO(setting.detailCategory.eventStart),
        settings: [],
      };
    }

    if (setting.budRest?.id) {
      dataGroupByDate[date].isSettingApplied = true;
    }

    // Ubah struktur jadi objek flat supaya
    // gampang handle state-nya di form
    dataGroupByDate[date].settings.push({
      budrestSettingId: setting.budRest?.id,
      date: setting.detailCategory.eventStart,
      type: setting.budRest?.type || "qualification",
      categoryDetailId: setting.detailCategory.id,
      categoryDetailLabel: setting.detailCategory.label,
      totalParticipant: setting.detailCategory.totalParticipant,
      start: setting.budRest?.budRestStart || "",
      end: setting.budRest?.budRestEnd || "",
      targetFace: setting.budRest?.targetFace || "",
    });
  }

  // Dibuat flat lagi jadi array
  return Object.values(dataGroupByDate);
}

export { useBudrestSettings };
