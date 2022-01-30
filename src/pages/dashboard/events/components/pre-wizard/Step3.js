import * as React from "react";
import NoticeDKIEvent from "./NoticeDKIEvent";
import InputEventKey from "./InputEventKey";

export default function Step3({ eventKey, onChange }) {
  const handleEventKeyChange = (ev) => onChange?.(ev);
  const handleEventKeyCheckClick = (ev) => {
    // TODO: fetch periksa event key ke backend
    alert(`Event Key: ${ev.target.value}`);
  };

  return (
    <div>
      <h1 className="mb-5">Daftar sebagai Event DKI Jakarta Series</h1>

      <NoticeDKIEvent className="mb-4">
        Untuk menjadi bagian dari Event DKI Jakarta Series, Anda memerlukan Key dari PERPANI DKI
        Jakarta. <strong>Dapat dikosongkan jika bukan bagian dari series.</strong>
      </NoticeDKIEvent>

      <InputEventKey
        name="eventKey"
        value={eventKey}
        onChange={handleEventKeyChange}
        onCheck={handleEventKeyCheckClick}
      />
    </div>
  );
}
