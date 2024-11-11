import * as React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Input, Label } from "reactstrap";

const CheckboxInput = ({
  name,
  label,
  options = [],
  onChange,
  inline = false,
  disabled,
  readOnly,
  value = [],
}) => {
  const [isFieldDirty, setsFieldDirty] = React.useState(false);
  const { errors, handleFieldValidation } = useFieldValidation(name);

  React.useEffect(() => {
    if (isFieldDirty) {
      handleFieldValidation(value);
    }
  }, [isFieldDirty, value]);

  const handleChange = (ev, option) => {
    if (!isFieldDirty) setsFieldDirty(true);

    const modifiedOptions = [...value];
    if (ev.target.checked) {
      modifiedOptions.push(option);
    } else {
      const index = _.findIndex(modifiedOptions, ["id", option.id]);
      modifiedOptions.splice(index, 1);
    }

    if (onChange) {
      onChange({ key: name, value: modifiedOptions });
    }
  };

  if (inline) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <div>
          {options.map((option) => {
            return (
              <div
                className={`form-check ${_.get(errors, name) ? "is-invalid" : ""}`}
                key={option.id}
                style={{ display: "inline-block", marginRight: 10 }}
              >
                <Input
                  type="checkbox"
                  className="form-check-Input"
                  id={option.id}
                  onChange={(e) => handleChange(e, option)}
                  name={name}
                  disabled={disabled}
                  readOnly={readOnly}
                  checked={
                    option.checked ||
                    value.includes(option.id) ||
                    _.findIndex(value, ["id", option.id]) != -1 ||
                    value
                  }
                />
                <Label className="form-check-label" htmlFor={option.id}>
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
        {_.get(errors, name)?.map((message) => (
          <div className="invalid-feedback" key={message}>
            {message}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      {options.map((option) => {
        return (
          <div className={`form-check ${errors?.[name] ? "is-invalid" : ""}`} key={option.id}>
            <Input
              type="checkbox"
              className="form-check-Input"
              id={option.id}
              onChange={(e) => handleChange(e)}
              disabled={disabled}
              readOnly={readOnly}
              checked={
                option.checked ||
                value.includes(option.id) ||
                _.findIndex(value, ["id", option.id]) != -1
              }
            />
            <Label className="form-check-label" htmlFor={option.id}>
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

CheckboxInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      checked: PropTypes.bool
    })
  ),
  onChange: PropTypes.func,
  inline: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  value: PropTypes.array
};

export default CheckboxInput;
