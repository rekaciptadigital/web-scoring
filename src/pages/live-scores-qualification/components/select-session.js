import * as React from "react";
import { useDisplaySettings } from "../contexts/display-settings";

import { SelectSetting } from "./select-settings";

// TODO: ambil jumlah sesi dari ngebaca list detail kategori
const sampleSessions = [1, 2, 0].map((label) => ({
  value: label,
  label: label > 0 ? "Sesi " + label : "Semua sesi",
}));

function SelectSession() {
  const { sessionNumber, setSessionNumber } = useDisplaySettings();
  const selectedValue = sampleSessions.find((s) => s.value === sessionNumber);
  return (
    <SelectSetting
      placeholder="Pilih sesi yang akan ditampilkan"
      noOptionsMessage="Tidak ada pilihan sesi"
      value={selectedValue || null}
      options={sampleSessions}
      onChange={(opt) => setSessionNumber(opt.value)}
    />
  );
}

export { SelectSession };
