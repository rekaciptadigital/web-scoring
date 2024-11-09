import * as React from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";
import { Input, InputGroup, Label } from "reactstrap";

// Functional Component untuk TextInput
const TextInput = React.memo(({
  name,
  id = stringUtil.createRandom(),
  label,
  placeholder,
  value,
  onChange,
  accessoryRight,
  readOnly,
  disabled,
}) => {
  const { errors, handleFieldValidation } = useFieldValidation(name);

  // Menggunakan useCallback untuk memoization fungsi handleChange
  const handleChange = React.useCallback((e) => {
    if (onChange) {
      onChange({
        key: name,
        value: e.target.value,
      });
    }
  }, [name, onChange]);

  // Menggunakan useCallback untuk memoization fungsi handleBlur
  const handleBlur = React.useCallback(() => {
    handleFieldValidation(value);
  }, [handleFieldValidation, value]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="text"
          className={`form-control ${_.get(errors, name) ? "is-invalid" : ""}`}
          id={id}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
        />
        {accessoryRight}
      </InputGroup>
    </div>
  );
});

export default TextInput;
