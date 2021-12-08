import * as React from "react";
import { SelectionCards, OptionCard, OptionTitle, OptionDescription } from "../SelectionCards";
import OptionComingSoon from "./OptionComingSoon";

const NAME_OPTION = "matchType";

export default function Step2({ matchType, onChange }) {
  const handleMatchTypeChange = (ev) => onChange?.(ev);
  return (
    <div>
      <h1 className="mb-5">Tentukan jenis pertandingan</h1>

      <SelectionCards value={matchType} onChange={handleMatchTypeChange}>
        <OptionCard name={NAME_OPTION} value="tournament">
          <OptionTitle>Turnamen</OptionTitle>
          <OptionDescription>
            Event sesuai dengan aturan World Archery&#47;PERPANI
          </OptionDescription>
        </OptionCard>

        <OptionComingSoon className="mt-3" blurTargetClassName="option-card">
          <OptionCard disabled name={NAME_OPTION} value="games" className="option-card">
            <OptionTitle>Games</OptionTitle>
            <OptionDescription>Event panahan bebas</OptionDescription>
          </OptionCard>
        </OptionComingSoon>
      </SelectionCards>
    </div>
  );
}
