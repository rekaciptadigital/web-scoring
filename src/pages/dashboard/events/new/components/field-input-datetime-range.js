import * as React from "react";
import styled from "styled-components";

import { FieldInputDateTimeColumns } from "./field-input-datetime-columns";

import { isBefore, isAfter, isSameDay, endOfDay } from "date-fns";
// import { FieldInputDateTimeColumnV2 } from "../screens/components/field-input-date-time-column-v2";

function FieldInputDateTimeRange({
  labelStart = { date: "Tanggal Mulai", time: "Jam Mulai" },
  labelEnd = { date: "Tanggal Akhir", time: "Jam Akhir" },
  value = { start: null, end: null },
  onChange,
  required,
  disabled,
  minDatetime,
}) {
  const handleChange = (action) => {
    const data = _getConstrainedRangeValue(value, action);
    onChange?.(data);
  };

  return (
    <SplitFields>
      {/* <FieldInputDateTimeColumnV2
        dateLabel={labelStart.date}
        timeLabel={labelStart.time}
        required={required}
        disabled={disabled}
        datetime={value.start}
        onChange={(datetime) => handleChange({ start: datetime })}
        selectsStart
        startDate={value.start}
        endDate={value.end}
        minDate={minDatetime}
      /> */}
      <FieldInputDateTimeColumns
        dateLabel={labelStart.date}
        timeLabel={labelStart.time}
        required={required}
        disabled={disabled}
        datetime={value.start}
        onChange={(datetime) => handleChange({ start: datetime })}
        selectsStart
        startDate={value.start}
        endDate={value.end}
        minDate={minDatetime}
      />

      <FieldInputDateTimeColumns
        dateLabel={labelEnd.date}
        timeLabel={labelEnd.time}
        required={required}
        disabled={disabled}
        datetime={value.end}
        onChange={(datetime) => handleChange({ end: datetime })}
        selectsEnd
        startDate={value.start}
        endDate={value.end}
        minDate={value.start || minDatetime}
        minTime={_getConstraintMinTimeEnd(value)}
        maxTime={_getConstraintMaxTimeEnd(value)}
      />
    </SplitFields>
  );
}

/* ========================= */
// styles

const SplitFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

/* ========================= */
// utils

// anggap reducer:
function _getConstrainedRangeValue(value, action) {
  // constraint #1: datetime akhir mengikuti datetime awal
  if ((action?.start && !value?.end) || isAfter(action?.start, value?.end)) {
    return {
      start: action.start,
      end: action.start,
    };
  }

  // constraint #2: datetime akhir gak boleh sebelum datetime awal, mentok ke datetime awal
  if (isBefore(action?.end, value?.start)) {
    return {
      ...value,
      end: value.start,
    };
  }

  return { ...value, ...action };
}

function _getConstraintMinTimeEnd(value) {
  if (isSameDay(value?.start, value?.end)) {
    return value.start;
  }
  return undefined;
}

function _getConstraintMaxTimeEnd(value) {
  if (_getConstraintMinTimeEnd(value)) {
    return endOfDay(value.end);
  }
  return undefined;
}

export { FieldInputDateTimeRange };
