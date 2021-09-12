import {
  // FileUpload,
  ImageUpload,
  RadioButtonInput,
  TextEditor,
  TextInput,
} from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { selectConstants } from "constants/index";

export const EventFormStep1 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <Row>
      <Col lg={3}>
        <Row>
          <Col lg={12}>
            <ImageUpload
              label="Upload Poster"
              name="poster"
              onChange={handleChange}
              thumbnail
            />
          </Col>
        </Row>
        {/* <Row>
          <Col lg={12}>
            <FileUpload
              label="Upload Handbook"
              name="handbook"
              onChange={handleChange}
            />
          </Col>
        </Row> */}
      </Col>
      <Col lg={9}>
        <Row>
          <Col lg={12}>
            <TextInput
              label="Nama Event"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6}>
            <TextInput
              label="Lokasi"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6}>
            <TextInput
              label="Kota"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Col>
          <Col lg={12}>
            <RadioButtonInput
              name="locationType"
              onChange={handleChange}
              options={selectConstants.eventLocationType}
              value={formData.locationType}
              valueOnly
            />
          </Col>
          <Col lg={12}>
            <TextEditor
              label="Deskripsi Tambahan"
              onChange={handleChange}
              name="description"
              value={formData.description}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
