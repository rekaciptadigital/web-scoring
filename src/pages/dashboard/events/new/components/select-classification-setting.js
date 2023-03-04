import React from "react";
import Select from "react-select";
import styled from "styled-components";

const SelectClassificationSetting = ({
  initialSelect,
  eventDetail,
  optionsData,
  placeholder,
  onSelectOption,
  onInputChange,
  label,
  classificationCategory,
  defaultValue,
  value,
}) => {
  const [options, setOptions] = React.useState([]);
  const defaultOptionWithContigent = [
    { label: "Negara", value: "country" },
    { label: "Provinsi", value: "province" },
    { label: "Kota", value: "city" },
  ];
  React.useEffect(() => {
    if (initialSelect) {
      if (eventDetail?.withContingent !== 0) {
        setOptions(defaultOptionWithContigent);
      } else {
        setOptions([...optionsData, ...classificationCategory?.classification]);
      }
    }
  }, [eventDetail, optionsData]);
  return (
    <div>
      {label ? <LabelSelectText>{label}</LabelSelectText> : null}
      <Select
        options={initialSelect ? options : optionsData ?? []}
        placeholder={
          initialSelect
            ? eventDetail?.withContingent === 0
              ? "Klub"
              : "Negara"
            : placeholder ?? ""
        }
        onInputChange={onInputChange}
        onChange={(val) => onSelectOption && onSelectOption(val)}
        getOptionLabel={(e) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {e.icon ? e.icon : null}
            <span style={{ marginLeft: 5 }}>{e.label}</span>
          </div>
        )}
        defaultValue={defaultValue}
        value={value}
      />
    </div>
  );
};

const LabelSelectText = styled.label`
  font-weight: 400;
  font-size: 12px;
  color: #1c1c1c;
`;

export default SelectClassificationSetting;
