import _ from "lodash";
import React from "react";
import Switch from "react-switch";
import { Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const Offsymbol = ({ text = "No" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {` ${text}`}
    </div>
  );
};

const OnSymbol = ({ text = "Yes" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      {` ${text}`}
    </div>
  );
};

const SwitchInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  onLabel,
  offLabel,
  value = false,
  onChange,
  error,
  onInfo,
  offInfo,
  disabled,
  readOnly,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e,
      });
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div>
        <Switch
          uncheckedIcon={<Offsymbol text={offLabel} />}
          checkedIcon={<OnSymbol text={onLabel} />}
          className="me-1 mb-sm-8 mb-2"
          onColor="#626ed4"
          onChange={() => {
            handleChange(!value);
          }}
          checked={value}
          disabled={disabled}
          readOnly={readOnly}
        />
        {value ? onInfo : offInfo}
      </div>
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default SwitchInput;
