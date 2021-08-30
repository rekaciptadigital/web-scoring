import { Accordion, CheckboxInput, DatetimeInput, TextInput } from "components";
import React from "react";
import { Col, Row } from "reactstrap";

export const EventFormStep3 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <Row>
      <Col lg={12}>
        <Accordion
          separateItem
          items={[
            {
              title: "Rincian Pendaftaran dan Lomba",
              alwaysOpen: true,
              body: (
                <Row>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Buka Pendaftaran"
                      name="registrationStartDatetime"
                      value={formData.registrationStartDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Tutup Pendaftaran"
                      name="registrationEndDatetime"
                      value={formData.registrationEndDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Mulai lomba"
                      name="eventStartDatetime"
                      value={formData.eventStartDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Selesai Lomba"
                      name="eventStartDatetime"
                      value={formData.eventEndDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              ),
            },
            {
              title: "Rincian Kualifikasi",
              alwaysOpen: true,
              hide: formData.eventType !== 'marathon',
              body: (
                <Row>
                  <Col lg={4}>
                    <DatetimeInput
                      label="Buka Kualifikasi"
                      name="quatificationStartDatetime"
                      value={formData.quatificationStartDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <DatetimeInput
                      label="Tutup Kualifikasi"
                      name="quatificationEndDatetime"
                      value={formData.quatificationEndDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <CheckboxInput
                      name="qualificationFreeOnHoliday"
                      value={formData.qualificationFreeOnHoliday}
                      onChange={handleChange}
                      options={[
                        {
                          id: 1,
                          label: "Weekend dan Tanggal Merah Libur",
                        },
                      ]}
                    />
                  </Col>
                  <Col lg={4}>
                    <TextInput
                      label="Sesi/Hari"
                      name="quatificationSessionPerDay"
                      value={formData.quatificationSessionPerDay || ""}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <TextInput
                      label="Kuota/Hari"
                      name="quatificationQuotaPerDay"
                      value={formData.quatificationQuotaPerDay || ""}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              ),
            },
            {
              title: "Rincian Eliminasi",
              alwaysOpen: true,
              hide: formData.eventType !== 'marathon',
              body: (
                <Row>
                  <Col lg={4}>
                    <DatetimeInput
                      label="Mulai Eliminasi"
                      name="eliminationStartDatetime"
                      value={formData.eliminationStartDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <DatetimeInput
                      label="Selesai Eliminasi"
                      name="eliminationEndDatetime"
                      value={formData.eliminationEndDatetime}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <CheckboxInput
                      name="eliminationFreeOnHoliday"
                      value={formData.eliminationFreeOnHoliday}
                      onChange={handleChange}
                      options={[
                        {
                          id: 1,
                          label: "Weekend dan Tanggal Merah Libur",
                        },
                      ]}
                    />
                  </Col>
                  <Col lg={4}>
                    <TextInput
                      label="Sesi/Hari"
                      name="eliminationSessionPerDay"
                      value={formData.eliminationSessionPerDay || ""}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={4}>
                    <TextInput
                      label="Kuota/Hari"
                      name="eliminationQuotaPerDay"
                      value={formData.eliminationQuotaPerDay || ""}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
};
