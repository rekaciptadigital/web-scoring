import React from "react";

import { Badge, Col, Row } from "reactstrap";
import {
  Accordion,
  Button,
  DateInput,
  DatetimeInput,
  NumberInput,
  SelectInput,
  SwitchInput,
  TimeInput,
} from "components";

export const EventFormStep3 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  const addSession = (dayIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].openDetails = true;
    qualificationDays[dayIndex]?.details.push({
      startTime: "00:00",
      endTime: "23:59",
      openEdit: true,
      quota: 0,
    });
    handleChange({
      key: "qualificationDays",
      value: qualificationDays,
    });
  };

  const expandSession = (dayIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].openDetails = qualificationDays[dayIndex].openDetails
      ? false
      : !qualificationDays[dayIndex].openDetails;
    handleChange({
      key: "qualificationDays",
      value: qualificationDays,
    });
  };

  const removeSessionItem = (dayIndex, detailIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].details.splice(detailIndex, 1);
    handleChange({
      key: "qualificationDays",
      value: qualificationDays,
    });
  };

  const saveSessionItem = (dayIndex, detailIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].details[detailIndex].openEdit = false;
    handleChange({
      key: "qualificationDays",
      value: qualificationDays,
    });
  };

  const editSessionItem = (dayIndex, detailIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].details[detailIndex].openEdit = true;
    handleChange({
      key: "qualificationDays",
      value: qualificationDays,
    });
  };

  const sumQuota = (items) => {
    let totalQuota = 0;
    items.map((item) => {
      totalQuota += parseInt(item.quota || 0);
    });

    return totalQuota;
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
                      validation={{ required: "Tanggal dan jam buka pendaftaran harus diisi" }}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Tutup Pendaftaran"
                      name="registrationEndDatetime"
                      value={formData.registrationEndDatetime}
                      onChange={handleChange}
                      validation={{ required: "Tanggal dan jam tutup pendaftaran harus diisi" }}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Mulai lomba"
                      name="eventStartDatetime"
                      value={formData.eventStartDatetime}
                      onChange={handleChange}
                      validation={{ required: "Tanggal dan jam mulai lomba harus diisi" }}
                    />
                  </Col>
                  <Col lg={6}>
                    <DatetimeInput
                      label="Selesai Lomba"
                      name="eventEndDatetime"
                      value={formData.eventEndDatetime}
                      onChange={handleChange}
                      validation={{ required: "Tanggal dan jam mulai lomba harus diisi" }}
                    />
                  </Col>
                </Row>
              ),
            },
            {
              title: "Rincian Kualifikasi",
              alwaysOpen: true,
              hide: formData.eventType !== "marathon",
              body: (
                <>
                  {formData.eventType === "marathon" && (
                    <Row>
                      <Col lg={3}>
                        <DateInput
                          label="Buka Kualifikasi"
                          name="qualificationStartDatetime"
                          value={formData.qualificationStartDatetime}
                          onChange={handleChange}
                          validation={{ required: "Tanggal pembukaan kualifikasi harus diisi" }}
                        />
                      </Col>
                      <Col lg={3}>
                        <DateInput
                          label="Tutup Kualifikasi"
                          name="qualificationEndDatetime"
                          value={formData.qualificationEndDatetime}
                          onChange={handleChange}
                          validation={{ required: "Tanggal penutupan kualifikasi harus diisi" }}
                        />
                      </Col>
                      <Col lg={3}>
                        <SelectInput
                          label="Sesi"
                          name="qualificationSessionLength"
                          value={formData.qualificationSessionLength}
                          options={[{ id: "60", label: "Per 1 Jam" }]}
                          onChange={handleChange}
                          validation={{ required: "Sesi harus diisi" }}
                        />
                      </Col>
                      <Col lg={3}>
                        <SwitchInput
                          name="qualificationWeekdaysOnly"
                          value={formData.qualificationWeekdaysOnly}
                          onChange={handleChange}
                          label="Weekday Only"
                        />
                      </Col>
                      <Col lg={12}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Hari</th>
                              <th>Sesi</th>
                              <th style={{ width: "1%", whiteSpace: "nowrap" }}>Detail Sesi</th>
                              <th>Kuota</th>
                              <th style={{ width: "1%", whiteSpace: "nowrap" }}>...</th>
                            </tr>
                          </thead>
                          {formData.qualificationDays.map((day, dayIndex) => (
                            <tbody key={day.id}>
                              <tr>
                                <td>{day.label}</td>
                                <td>
                                  <Badge className="bg-info" style={{ fontSize: "1em" }}>
                                    {day.details?.length} Sesi
                                  </Badge>
                                </td>
                                <td>
                                  {day.details?.[0]?.startTime} - {day.details?.[0]?.endTime}
                                </td>
                                <td>
                                  <Badge className="bg-info" style={{ fontSize: "1em" }}>
                                    {sumQuota(day.details)}
                                  </Badge>
                                </td>
                                <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                                  <Button
                                    type="light"
                                    icon="plus-circle"
                                    outline
                                    size="sm"
                                    onClick={() => addSession(dayIndex)}
                                  />{" "}
                                  <Button
                                    type="light"
                                    icon={day.openDetails ? "chevron-up" : "chevron-down"}
                                    outline
                                    size="sm"
                                    onClick={() => expandSession(dayIndex)}
                                  />
                                </td>
                              </tr>
                              {day.openDetails &&
                                day.details.map((detail, detailIndex) => (
                                  <tr key={detailIndex} style={{ background: "#F8F9FA" }}>
                                    <td></td>
                                    <td>Sesi {detailIndex + 1}</td>
                                    <td
                                      style={{
                                        width: "1%",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {detail.openEdit ? (
                                        <div style={{ display: "flex" }}>
                                          <div style={{ width: 140 }}>
                                            <TimeInput
                                              name={`qualificationDays.${dayIndex}.details.${detailIndex}.startTime`}
                                              value={detail.startTime}
                                              onChange={handleChange}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              width: 20,
                                              textAlign: "center",
                                              paddingTop: 10,
                                            }}
                                          >
                                            -
                                          </div>
                                          <div style={{ width: 140 }}>
                                            <TimeInput
                                              name={`qualificationDays.${dayIndex}.details.${detailIndex}.endTime`}
                                              value={detail.endTime}
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        `${detail.startTime} - ${detail.endTime}`
                                      )}
                                    </td>
                                    <td style={{ width: "1%" }}>
                                      {detail.openEdit ? (
                                        <div style={{ width: 100 }}>
                                          <NumberInput
                                            name={`qualificationDays.${dayIndex}.details.${detailIndex}.quota`}
                                            value={detail.quota}
                                            onChange={handleChange}
                                          />
                                        </div>
                                      ) : (
                                        detail.quota
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        width: "1%",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {detail.openEdit ? (
                                        <Button
                                          type="primary"
                                          icon="check"
                                          outline
                                          size="sm"
                                          onClick={() => saveSessionItem(dayIndex, detailIndex)}
                                        />
                                      ) : (
                                        <Button
                                          type="warning"
                                          icon="pencil"
                                          outline
                                          size="sm"
                                          onClick={() => editSessionItem(dayIndex, detailIndex)}
                                        />
                                      )}{" "}
                                      <Button
                                        type="danger"
                                        icon="trash"
                                        outline
                                        size="sm"
                                        onClick={() => removeSessionItem(dayIndex, detailIndex)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          ))}
                        </table>
                      </Col>
                    </Row>
                  )}
                </>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
};
