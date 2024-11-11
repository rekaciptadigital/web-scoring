import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Input, InputGroup, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const EmailInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  accessoryRight,
  error,
  readOnly,
  disabled,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e.target.value,
      });
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="email"
          className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
          id={id}
          onChange={handleChange}
          value={value}
          placeholder={label}
          readOnly={readOnly}
          disabled={disabled}
        />
        {accessoryRight}
      </InputGroup>
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

EmailInput.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  accessoryRight: PropTypes.node,
  error: PropTypes.object,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default EmailInput;
