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
  textDetail,
}) => {
  const [options, setOptions] = React.useState([]);
  React.useEffect(() => {
    if (initialSelect) {
      setOptions([...optionsData, ...classificationCategory?.classification]);
    }
  }, [eventDetail, optionsData]);
  return (
    <div>
      {label ? <LabelSelectText>{label}</LabelSelectText> : null}
      <Select
        options={initialSelect ? options : optionsData ?? []}
        placeholder={initialSelect ? "Klub" : placeholder ?? ""}
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
      {textDetail?.length ? (
        <InfoTextClassification>{textDetail}</InfoTextClassification>
      ) : null}
    </div>
  );
};

const LabelSelectText = styled.label`
  font-weight: 400;
  font-size: 12px;
  color: #1c1c1c;
`;

const InfoTextClassification = styled.span`
  color: #545454;
  font-weight: 400;
  font-size: 12px;
`;

export default SelectClassificationSetting;
