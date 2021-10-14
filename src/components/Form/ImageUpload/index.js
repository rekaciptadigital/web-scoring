import React, { useState } from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Input, Label } from "reactstrap";

const ImageUpload = ({
  id = stringUtil.createRandom(),
  name,
  label,
  onChange,
  multiple = false,
  thumbnail = false,
  disabled,
  readOnly,
  base64,
}) => {
  const [uploadedImage, setUploadedImage] = useState();
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (ev) => {
    base64(ev);
    setUploadedImage(URL.createObjectURL(ev.target.files[0]));
    if (onChange) {
      onChange({
        key: name,
        value: multiple ? ev.target.files : ev.target.files[0],
      });
    }
    handleFieldValidation(multiple ? ev.target.files : ev.target.files[0]);
  };

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="form-label">
          {label}
        </Label>
      )}
      {thumbnail && (
        <div className="input-file-thumbnail">
          <label className={`label ${_.get(errors, name) ? "is-invalid" : ""}`} htmlFor={id}>
            {uploadedImage ? (
              <img src={uploadedImage} width="100%" className="icon" />
            ) : (
              <>
                <i className="bx bx-camera icon" />
              </>
            )}
          </label>
        </div>
      )}
      <Input
        className={`d-none form-control ${_.get(errors, name) ? "is-invalid" : ""}`}
        id={id}
        type="file"
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
      />
      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
