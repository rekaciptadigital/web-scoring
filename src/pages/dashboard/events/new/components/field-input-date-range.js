import * as React from "react";
import styled from "styled-components";

import FieldInputDateSmall from "../../components/form-fields/field-input-date-small";

function FieldInputDateRange({
  labelStart = "Tanggal Awal",
  labelEnd = "Tanggal Akhir",
  daterange = { start: null, end: null },
  onChange,
  required,
  minDate,
  maxDate,
}) {
  return (
    <PairedDateTimeFields>
      <FieldInputDateSmall
        label={labelStart}
        placeholder="HH/BB/TTTT"
        required={required}
        value={daterange?.start}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        // date range configs
        selectsStart
        startDate={daterange?.start}
        endDate={daterange?.end}
      />

      <FieldInputDateSmall
        label={labelEnd}
        placeholder="HH/BB/TTTT"
        required={required}
        value={daterange?.end}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        // date range configs
        selectsEnd
        startDate={daterange?.start}
        endDate={daterange?.end}
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

export { FieldInputDateRange };
