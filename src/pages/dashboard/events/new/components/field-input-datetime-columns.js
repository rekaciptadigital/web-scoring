import * as React from "react";
import styled from "styled-components";

import FieldInputDateSmall from "../../components/form-fields/field-input-date-small";
import FieldInputTimeSmall from "../../components/form-fields/field-input-time-small";

function FieldInputDateTimeColumns({
  datetime,
  onChange,
  dateLabel = "Tanggal",
  dateName,
  datePlaceholder = "HH/BB/TTTT",
  timeLabel = "Waktu",
  timeName,
  timePlaceholder = "00:00",
  required,
  disabled,
  minDate,
  maxDate,
  minTime,
  maxTime,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
}) {
  return (
    <PairedDateTimeFields>
      <FieldInputDateSmall
        label={dateLabel}
        placeholder={datePlaceholder}
        name={dateName}
        id={dateName}
        required={required}
        disabled={disabled}
        value={datetime}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
      />

      <FieldInputTimeSmall
        label={timeLabel}
        placeholder={timePlaceholder}
        name={timeName}
        id={timeName}
        required={required}
        disabled={disabled}
        minTime={minTime}
        maxTime={maxTime}
        value={datetime}
        onChange={onChange}
      />
    </PairedDateTimeFields>
  );
}

/* ========================= */
// styles

const PairedDateTimeFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem 1rem;
`;

export { FieldInputDateTimeColumns };
