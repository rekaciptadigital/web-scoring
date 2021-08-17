import React, { useState } from "react";
import { Input, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const ImageUpload = ({
  id = stringUtil.createRandom(),
  name,
  label,
  onChange,
  multiple = false,
  thumbnail = true,
  error,
}) => {
  const [uploadedImage, setUploadedImage] = useState();

  const handleChange = e => {
    setUploadedImage(URL.createObjectURL(e.target.files[0]));
    if (onChange)
      onChange({
        key: name,
        value: multiple ? e.target.files : e.target.files[0],
      });
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
          <label className="label" htmlFor={id}>
            {uploadedImage ? (
              <img src={uploadedImage} width="100%" className="icon" />
            ) : (
              <><i className="bx bx-camera icon" /></>
            )}
          </label>
        </div>
      )}
      <Input
        className="form-control"
        id={id}
        type="file"
        onChange={handleChange}
        style={{ display: thumbnail ? "none" : "block" }}
      />
      {error?.[name]?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
