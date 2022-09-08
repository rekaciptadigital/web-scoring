import * as React from "react";

import {
  KnobGroupLayout,
  KnobsClassCategories,
  KnobsTeamCategories,
  Knobs,
} from "components/ma/toolbar-filters";

function SelectionKnobsView({ standingValue, onChangeStanding }) {
  return (
    <KnobGroupLayout>
      <KnobsClassCategories />
      <KnobsTeamCategories
        shouldHideOption={(option) => {
          return !["individu male", "individu female"].includes(option.value);
        }}
      />
      <KnobsStandings value={standingValue} onChange={onChangeStanding} />
    </KnobGroupLayout>
  );
}

function KnobsStandings({ value, onChange }) {
  return (
    <Knobs
      label="Klasemen"
      options={[
        { value: 3, label: "Kualifikasi" },
        { value: 4, label: "Eliminasi" },
        { value: 0, label: "Hasil Akhir" },
      ]}
      activeKnobId={value}
      onChange={onChange}
    />
  );
}

export { SelectionKnobsView };
