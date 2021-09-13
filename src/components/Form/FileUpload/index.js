import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Label, Row } from "reactstrap";
import stringUtil from "utils/stringUtil";
import Dropzone from "react-dropzone";
import _ from "lodash";

const FileUpload = ({
  id = stringUtil.createRandom(),
  name,
  label,
  onChange,
  multiple = false,
  error,
  disabled,
  readOnly,
}) => {
  const [selectedFiles, setselectedFiles] = useState([]);

  const handleChange = files => {
    files.map(file =>
      Object.assign(file, {
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
    if (onChange)
      onChange({
        key: name,
        value: multiple ? files : files[0],
      });
  };

  const handleDelete = () => {
    setselectedFiles([]);
    if (onChange)
      onChange({
        key: name,
        value: undefined,
      });
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="form-label">
          {label}
        </Label>
      )}
      <Dropzone
        onDrop={acceptedFiles => {
          handleChange(acceptedFiles);
        }}
        multiple={multiple}
        disabled={disabled || readOnly}
      >
        {({ getRootProps, getInputProps }) => (
          <div className={`dropzone ${_.get(error, name) ? "is-invalid" : ""}`}>
            <div className="dz-message needsclick mt-2" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="mb-3">
                <i className="display-4 text-muted bx bxs-cloud-upload" />
              </div>
              <h4>Drop files here or click to upload.</h4>
            </div>
          </div>
        )}
      </Dropzone>
      <div className="dropzone-previews mt-3" id="file-previews">
        {selectedFiles.map((f, i) => {
          return (
            <Card
              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
              key={i + "-file"}
            >
              <div className="p-2">
                <Row className="align-items-center">
                  <Col className="col-auto">
                    <button
                      type="button"
                      className={`btn btn-link`}
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      <i className={`bx bx-trash font-size-16 align-middle`} />
                    </button>
                  </Col>
                  <Col>
                    <Link to="#" className="text-muted font-weight-bold">
                      {f.name}
                    </Link>
                    <p className="mb-0">
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          );
        })}
      </div>
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
