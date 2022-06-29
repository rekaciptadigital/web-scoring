import * as React from "react";

import { SelectSetting } from "./select-settings";

const sampleSessions = [1, 2].map((label) => ({ value: label, label: "Sesi " + label }));

function SelectSession({ value, onChange }) {
  const selectedValue = sampleSessions.find((s) => s.value === value);
  return (
    <SelectSetting
      placeholder="Pilih sesi yang akan ditampilkan"
      noOptionsMessage="Tidak ada pilihan sesi"
      value={selectedValue || null}
      options={sampleSessions}
      onChange={(opt) => onChange?.(opt.value)}
    />
  );
}

export { SelectSession };
