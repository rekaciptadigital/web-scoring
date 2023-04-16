import React from "react";
import styled from "styled-components";
import { FieldInputDateSmallWithTriger } from "./field-input-date-small-with-trigger";
// import FieldInputDateSmallWithTriger from "./field-input-date-small-with-trigger";

function FieldInputDateTimeColumnV2({
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
  React.useEffect(() => {
    console.log("dateName:", dateName);
  }, [
    datetime,
    onChange,
    dateLabel,
    dateName,
    datePlaceholder,
    timeLabel,
    timeName,
    timePlaceholder,
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
  ]);
  return (
    <PairedDateTimeFields>
      <FieldInputDateSmallWithTriger
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
    </PairedDateTimeFields>
  );
}

const PairedDateTimeFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem 1rem;
`;

export { FieldInputDateTimeColumnV2 };
