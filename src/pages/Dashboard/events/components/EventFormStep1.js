import {
  DatetimeInput,
  FileUpload,
  ImageUpload,
  RadioButtonInput, TextEditor,
  TextInput
} from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { selectConstants } from "../../../../constants";

export const EventFormStep1 = ({ onFormFieldChange }) => {
  const handleChange = ({key, value}) => {
    console.log({key, value})
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <Row>
      <Col lg={3}>
        <Row>
          <Col lg={12}>
            <ImageUpload label="Upload Poster" name="poster" onChange={handleChange} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FileUpload label="Upload Handbook" />
          </Col>
        </Row>
      </Col>
      <Col lg={9}>
        <Row>
          <Col lg={12}>
            <TextInput label="Nama Event" name="eventName" />
          </Col>
          <Col lg={6}>
            <DatetimeInput label="Buka Pendaftaran" onChange={handleChange} />
          </Col>
          <Col lg={6}>
            <DatetimeInput label="Tutup Pendaftaran" />
          </Col>
          <Col lg={6}>
            <DatetimeInput label="Mulai lomba" />
          </Col>
          <Col lg={6}>
            <DatetimeInput label="Selesai Lomba" />
          </Col>
          <Col lg={6}>
            <TextInput label="Lokasi" />
          </Col>
          <Col lg={6}>
            <TextInput label="Kota" onChange={handleChange} />
          </Col>
          <Col lg={12}>
            <RadioButtonInput options={selectConstants.eventLocationType} onChange={handleChange} valueOnly />
          </Col>
          <Col lg={12}>
            <TextEditor label="Deskripsi Tambahan" onChange={handleChange} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
