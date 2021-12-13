import * as React from "react";
import styled from "styled-components";

import { Row, Col } from "reactstrap";
import FormSheet from "../FormSheet";
import { TextEditor } from "components";
import PosterImagePicker from "../PosterImagePicker";
import { FieldInputText, FieldSelect, FieldSelectRadio } from "../form-fields";

const FieldInput = styled.div`
  .field-label,
  .field-date-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-date-label {
    font-size: 12px;
  }

  .field-radio-label {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;

    .field-radio-input {
      margin-right: 0.5rem; /* 8px, dari 1rem = 16px di :root */
    }
  }

  .field-input-text,
  .field-input-date {
    display: block;
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: #eff2f7;
      opacity: 1;
    }
  }

  .field-input-date {
    font-size: 12px;
  }
`;

export function Step1() {
  return (
    <FormSheet>
      <h3 className="mb-3">Banner Event</h3>

      <PosterImagePicker image={undefined} onChange={(ev) => alert(ev?.target?.value)} />

      <hr />
      <h3 className="mt-4 mb-3">Judul dan Deskripsi</h3>

      <Row>
        <Col md={12} className="mt-2">
          <FieldInputText required name="eventName" placeholder="Nama Event">
            Nama Event
          </FieldInputText>
        </Col>

        <Col md={6} className="mt-2">
          <FieldInputText required name="location" placeholder="Lokasi">
            Lokasi
          </FieldInputText>
        </Col>

        <Col md={6} className="mt-2">
          <FieldSelect
            name="city"
            required
            placeholder="Kota"
            options={[
              { label: "Bekasi", value: "Bekasi" },
              { label: "Jakarta", value: "Jakarta" },
            ]}
          >
            Kota
          </FieldSelect>
        </Col>

        <Col md={6} className="mt-2">
          <FieldSelectRadio
            name="locationType"
            options={[
              { label: "Indoor", value: "indoor" },
              { label: "Outdoor", value: "outdoor" },
              { label: "Both", value: "both" },
            ]}
          />
        </Col>
      </Row>

      <h5
        className="mt-3 mb-3"
        style={{ color: "var(--ma-gray-600)", fontSize: 14, fontWeight: "normal" }}
      >
        Tanggal Pendaftaran dan Lomba
      </h5>

      <Row>
        <Col md={4}>
          <FieldInput>
            <label className="field-date-label">Buka Pendaftaran</label>
            <input
              className="field-input-date"
              placeholder="DD/MM/YYYY"
              name="registrationDateStart"
              required
            />
          </FieldInput>
        </Col>

        <Col md={2}>
          <FieldInput>
            <label className="field-date-label">Jam Buka</label>
            <input
              className="field-input-date"
              placeholder="00:00"
              name="registrationTimeStart"
              required
            />
          </FieldInput>
        </Col>

        <Col md={4}>
          <FieldInput>
            <label className="field-date-label">Tutup Pendaftaran</label>
            <input
              className="field-input-date"
              placeholder="DD/MM/YYYY"
              name="registrationDateEnd"
              required
            />
          </FieldInput>
        </Col>

        <Col md={2}>
          <FieldInput>
            <label className="field-date-label">Jam Tutup</label>
            <input
              className="field-input-date"
              placeholder="00:00"
              name="registrationTimeEnd"
              required
            />
          </FieldInput>
        </Col>

        <Col md={12}>
          <TextEditor
            label="Deskripsi Tambahan"
            name="description"
            placeholder="Hadiah kompetisi, Flow lomba, peraturan, informasi tambahan mengenai lomba..."
          />
        </Col>
      </Row>
    </FormSheet>
  );
}
