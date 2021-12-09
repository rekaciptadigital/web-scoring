import * as React from "react";
import { eventConfigs } from "constants/index";

import { SelectionCards, OptionCard, OptionTitle, OptionDescription } from "../SelectionCards";
import OptionComingSoon from "./OptionComingSoon";

const NAME_OPTION = "matchType";
const { MATCH_TYPES } = eventConfigs;

export default function Step2({ matchType, onChange }) {
  const handleMatchTypeChange = (ev) => onChange?.(ev);
  return (
    <div>
      <h1 className="mb-5">Tentukan jenis pertandingan</h1>

      <SelectionCards value={matchType} onChange={handleMatchTypeChange}>
        <OptionCard name={NAME_OPTION} value={MATCH_TYPES.TOURNAMENT}>
          <OptionTitle>Turnamen</OptionTitle>
          <OptionDescription>
            Event sesuai dengan aturan World Archery&#47;PERPANI
          </OptionDescription>
        </OptionCard>

        <OptionComingSoon className="mt-3" blurTargetClassName="option-card">
          <OptionCard disabled name={NAME_OPTION} value={MATCH_TYPES.GAMES} className="option-card">
            <OptionTitle>Games</OptionTitle>
            <OptionDescription>Event panahan bebas</OptionDescription>
          </OptionCard>
        </OptionComingSoon>
      </SelectionCards>
    </div>
  );
}
