import * as React from "react";
import { eventConfigs } from "constants/index";

import { SelectionCards, OptionCard, OptionTitle, OptionDescription } from "../SelectionCards";

const NAME_OPTION = "eventType";
const { EVENT_TYPES } = eventConfigs;

export default function Step1({ eventType, onChange }) {
  const handleEventTypeChange = (ev) => onChange?.(ev);
  return (
    <div>
      <h1 className="mb-5">Tentukan jenis waktu pelaksanaan</h1>

      <SelectionCards value={eventType} onChange={handleEventTypeChange}>
        <OptionCard name={NAME_OPTION} value={EVENT_TYPES.FULLDAY}>
          <OptionTitle>Full Day</OptionTitle>
          <OptionDescription>
            Kualifikasi &amp; Eliminasi per kategori selesai dalam waktu 1 hari
          </OptionDescription>
        </OptionCard>

        <OptionCard name={NAME_OPTION} value={EVENT_TYPES.MARATHON} className="option-card mt-3">
          <OptionTitle>Marathon</OptionTitle>
          <OptionDescription>
            Kualifikasi &amp; Eliminasi per kategori selesai lebih dari 1 hari
          </OptionDescription>
        </OptionCard>
      </SelectionCards>
    </div>
  );
}
