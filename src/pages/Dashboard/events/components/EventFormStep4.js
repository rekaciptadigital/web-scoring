import { dummyConstants, selectConstants } from "../../../../constants";
import React from "react";
import { Col, Row } from "reactstrap";
import { CheckboxInput, DatetimeInput } from "components";

export const EventFormStep4 = () => {
  return (
    <>
      <Row>
        <Col lg={4}>
          <img
            className="rounded ms-2"
            alt="Skote"
            width="100%"
            src={
              "https://poster.keepcalmandposters.com/default/5555009_keep_calm_and_lets_code.png"
            }
          />
        </Col>
        <Col lg={8}>
          <table className="table">
            <tr>
              <td>Tanggal Lomba</td>
              <td>: 01 Agustus 2022 - 01 Agustus 2023</td>
            </tr>
            <tr>
              <td>Tanggal Pendaftaran</td>
              <td>: 01 Agustus 2020 - 01 Agustus 2021</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <i className="bx bx-map" /> Gelora Bung Karno
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                aliquet elementum facilisis. Ut vitae odio ex. Aliquam auctor
                massa quis augue egestas euismod vel id purus. Curabitur leo
                est, fringilla et sagittis id, congue nec massa. Vestibulum ante
                ipsum primis in faucibus orci luctus et ultrices posuere cubilia
                curae; Suspendisse condimentum dolor sollicitudin, tristique
                ligula quis, lacinia nibh. Nunc sagittis augue facilisis
                bibendum viverra. Etiam sodales lacus lacus, ut bibendum nisi
                hendrerit eget. Sed porta rhoncus dui non egestas. Quisque sed
                elementum nibh, quis rhoncus est. Sed ac sem justo. Nulla nibh
                neque, laoreet nec porttitor tempus, sagittis vel ex. Donec nisl
                dolor, sagittis id interdum sit amet, tristique eget justo. In
                eget tempor lacus, at molestie risus. In hac habitasse platea
                dictumst. Proin nec massa mi.
              </td>
            </tr>
          </table>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kelas</th>
                <th>Batas Lahir</th>
                <th>Jarak</th>
                <th>Kuota</th>
                <th>Biaya registrasi</th>
                <th>Jenis</th>
              </tr>
            </thead>
            <tbody>
              {dummyConstants.eventCategories.map(category => {
                return (
                  <tr key={category.no}>
                    <td>{category.no}</td>
                    <td>{category.ageCategory}</td>
                    <td>{category.maxDateOfBirth}</td>
                    <td>{category.distance}</td>
                    <td>{category.quota}</td>
                    <td>{category.registrationFee}</td>
                    <td>{category.teamCategories}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Siapa yang bisa melihat event Anda?"
            options={selectConstants.eventAudiences}
            inline
          />
        </Col>
        <Col lg={12}>
          <CheckboxInput
            label="Kapan waktu publikasi event Anda?"
            options={selectConstants.eventPublishTime}
            inline
          />
        </Col>
        <Col lg={5}>
            <DatetimeInput />
        </Col>
      </Row>
    </>
  );
};
