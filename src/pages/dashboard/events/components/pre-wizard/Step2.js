import * as React from "react";
import { eventConfigs } from "constants/index";

import { SelectionCards, OptionCard, OptionTitle, OptionDescription } from "../SelectionCards";
import OptionComingSoon from "./OptionComingSoon";

const NAME_OPTION = "matchType";
const { EVENT_TYPES, MATCH_TYPES } = eventConfigs;

export default function Step2({ eventType, matchType, onChange }) {
  const handleMatchTypeChange = (ev) => onChange?.(ev);
  return (
    <div>
      <h1 className="mb-5">Tentukan jenis pertandingan</h1>

      <SelectionCards value={matchType} onChange={handleMatchTypeChange}>
        {eventType === EVENT_TYPES.FULLDAY ? (
          <React.Fragment>
            <OptionCard name={NAME_OPTION} value={MATCH_TYPES.TOURNAMENT}>
              <OptionTitle>Turnamen</OptionTitle>
              <OptionDescription>
                Event sesuai dengan aturan World Archery&#47;PERPANI
              </OptionDescription>
            </OptionCard>

            <OptionComingSoon className="mt-3" blurTargetClassName="option-card">
              <OptionCard
                disabled
                name={NAME_OPTION}
                value={MATCH_TYPES.GAMES}
                className="option-card"
              >
                <OptionTitle>Games</OptionTitle>
                <OptionDescription>Event panahan bebas</OptionDescription>
              </OptionCard>
            </OptionComingSoon>

            <OptionCard name={NAME_OPTION} value={MATCH_TYPES.SELEKSI} className="mt-3">
              <OptionTitle>Seleksi</OptionTitle>
              <OptionDescription>Event seleksi archer</OptionDescription>
            </OptionCard>
          </React.Fragment>
        ) : eventType === EVENT_TYPES.MARATHON ? (
          <React.Fragment>
            <OptionComingSoon blurTargetClassName="option-card">
              <OptionCard disabled name={NAME_OPTION} value={MATCH_TYPES.TOURNAMENT}>
                <OptionTitle>Turnamen</OptionTitle>
                <OptionDescription>
                  Event sesuai dengan aturan World Archery&#47;PERPANI
                </OptionDescription>
              </OptionCard>
            </OptionComingSoon>

            <OptionCard name={NAME_OPTION} value={MATCH_TYPES.GAMES} className="option-card mt-3">
              <OptionTitle>Games</OptionTitle>
              <OptionDescription>Event panahan bebas</OptionDescription>
            </OptionCard>
          </React.Fragment>
        ) : (
          <OptionComingSoon blurTargetClassName="option-card">
            <OptionCard disabled name={NAME_OPTION} value={matchType} className="option-card">
              <OptionTitle>Jenis waktu pelaksanaan tidak diketahui</OptionTitle>
              <OptionDescription>
                Silakan kembali ke langkah sebelumnya untuk memilih
              </OptionDescription>
            </OptionCard>
          </OptionComingSoon>
        )}
      </SelectionCards>
    </div>
  );
}
