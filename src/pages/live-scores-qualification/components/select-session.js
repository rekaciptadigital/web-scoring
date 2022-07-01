import * as React from "react";
import { useDisplaySettings } from "../contexts/display-settings";

import { SelectSetting } from "./select-settings";

function SelectSession({ disabled }) {
  const { maxSessionCount, sessionNumber, setSessionNumber } = useDisplaySettings();
  const options = React.useMemo(() => _makeOptions(maxSessionCount), [maxSessionCount]);
  const selectedValue = options.find((s) => s.value === sessionNumber);
  return (
    <SelectSetting
      placeholder="Pilih sesi yang akan ditampilkan"
      noOptionsMessage="Tidak ada pilihan sesi"
      value={selectedValue || null}
      options={options}
      onChange={(opt) => setSessionNumber(opt.value)}
      disabled={disabled}
    />
  );
}

function _makeOptions(count) {
  if (!count) {
    return [];
  }
  const defaultSession = { value: 0, label: "Semua Sesi" };
  const arrayFromCount = [...new Array(count)];
  const options = arrayFromCount.map((item, index) => {
    const sessionNumber = index + 1;
    return {
      value: sessionNumber,
      label: "Sesi " + sessionNumber,
    };
  });
  return [...options, defaultSession];
}

export { SelectSession };
