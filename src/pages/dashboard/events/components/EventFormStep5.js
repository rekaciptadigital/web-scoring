import { CheckboxInput, DatetimeInput, SwitchInput } from "components";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { Col, Row } from "reactstrap";
import { selectConstants } from "../../../../constants";

export const EventFormStep5 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };
  return (
    <>
      <Row>
        <Col lg={4}>
          <img
            className="rounded"
            alt="Skote"
            width="100%"
            src={formData.poster ? URL.createObjectURL(formData.poster) : "/images/no-image.jpeg"}
          />
        </Col>
        <Col lg={8}>
          <table className="table">
            <tbody>
              <tr>
                <td>Tanggal Lomba</td>
                <td>
                  {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                </td>
              </tr>
              <tr>
                <td>Tanggal Pendaftaran</td>
                <td>
                  {formData.registrationStartDatetime} s/d{" "}
                  {formData.registrationEndDatetime}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <i className="bx bx-map" /> {formData.location}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>{ReactHtmlParser(formData.description)}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Siapa yang bisa melihat event Anda?"
            name="target"
            onChange={handleChange}
            options={selectConstants.eventAudiences}
            inline
            value={formData.target}
          />
        </Col>
        <Col lg={12}>
          <SwitchInput
            label="Kapan waktu publikasi event Anda?"
            name="publishNow"
            onChange={handleChange}
            value={formData.publishNow}
            inline
            onInfo="Sekarang"
            offInfo="Dijadwalkan"
          />
        </Col>
        {!formData.publishNow && (
          <Col lg={5}>
            <DatetimeInput name="publishDatetime" onChange={handleChange} />
          </Col>
        )}
      </Row>
    </>
  );
};
