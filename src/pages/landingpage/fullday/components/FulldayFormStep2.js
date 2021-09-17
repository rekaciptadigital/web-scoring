import React from "react";
import { Col, Row } from "reactstrap";

export const FulldayFormStep2 = ({ formData }) => {
  return (
    <>
      <Row>
        <Col lg={8}>
          <table className="table">
            <tbody>
              <tr>
                <td>Email :</td>
                <td>{formData.email}</td>
              </tr>
              <tr>
                <td>No. Telp :</td>
                <td>{formData.phone}</td>
              </tr>
              <tr>
                <td>Nama Klub :</td>
                <td>{formData.clubName}</td>
              </tr>
              <tr>
                <td>Nama Peserta :</td>
                <td>
                  {formData.participantMembers[0] &&
                  formData.participantMembers[0].name
                    ? formData.participantMembers[0].name
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Tanggal Lahir Peserta :</td>
                <td>
                  {formData.participantMembers[0] &&
                  formData.participantMembers[0].birthdate
                    ? formData.participantMembers[0].birthdate
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Gender :</td>
                <td>
                  {formData.participantMembers[0]
                    ? formData.participantMembers[0].gender &&
                      formData.participantMembers[0].gender.label
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};
