import {
  DatetimeInput,
  FileUpload,
  ImageUpload,
  RadioButtonInput,
  TextareaInput,
  TextInput,
} from "components";
import { selectConstants } from "../../../../constants";
import React from "react";
import { Col, Row } from "reactstrap";

export const EventFormStep1 = () => {
  return (
    <Row>
      <Col lg={3}>
        <Row>
          <Col lg={12}>
            <ImageUpload label="Upload Poster" />
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
            <TextInput label="Nama Event" />
          </Col>
          <Col lg={6}>
            <DatetimeInput label="Buka Pendaftaran" />
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
            <TextInput label="Kota" />
          </Col>
          <Col lg={12}>
            <RadioButtonInput options={selectConstants.eventLocationType} />
          </Col>
          <Col lg={12}>
            <TextareaInput label="Deskripsi Tambahan" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
