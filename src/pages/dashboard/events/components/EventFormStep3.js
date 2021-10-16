import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";
import _ from "lodash";
import moment from "moment";

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
import QualificationDaysPlaceholder from "./QualificationDaysPlaceholder";

export const EventFormStep3 = ({ onFormFieldChange, formData }) => {
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();

  const qualificationDays = formData.qualificationWeekdaysOnly
    ? formData.qualificationDays.filter((day) => day.weekday)
    : formData.qualificationDays;

  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  const addSession = (dayIndex) => {
    const qualificationDays = [...formData.qualificationDays];
    qualificationDays[dayIndex].openDetails = true;
    const sessionDuration = formData.qualificationSessionLength.value; // dalam menit
    const details = qualificationDays[dayIndex].details;

    const newSession = createSessionData(details, sessionDuration);
    qualificationDays[dayIndex]?.details.push(newSession);
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

    // Invalidate pesan error ketika sudah ada item sesi yang disimpan
    // TODO: refaktor pakai hook `useFieldValidation`?
    if (errors.qualificationDaysDetails) {
      const errorsUpdated = { ...errors };
      delete errorsUpdated.qualificationDaysDetails;
      dispatch(EventsStore.errors(errorsUpdated));
    }
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
                      name="eventEndDatetime"
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
              hide: formData.eventType !== "marathon",
              body: (
                <>
                  {formData.eventType === "marathon" && (
                    <React.Fragment>
                      <Row>
                        <Col lg={3}>
                          <DateInput
                            label="Buka Kualifikasi"
                            name="qualificationStartDatetime"
                            value={formData.qualificationStartDatetime}
                            onChange={handleChange}
                          />
                        </Col>

                        <Col lg={3}>
                          <DateInput
                            label="Tutup Kualifikasi"
                            name="qualificationEndDatetime"
                            value={formData.qualificationEndDatetime}
                            onChange={handleChange}
                          />
                        </Col>

                        <Col lg={3}>
                          <SelectInput
                            label="Sesi"
                            name="qualificationSessionLength"
                            value={formData.qualificationSessionLength}
                            options={[{ id: "60", label: "Per 1 Jam" }]}
                            onChange={handleChange}
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
                      </Row>

                      <Row>
                        <Col lg={12}>
                          {!formData.qualificationSessionLength && (
                            <QualificationDaysPlaceholder qualificationDays={qualificationDays} />
                          )}

                          {formData.qualificationSessionLength && (
                            <div>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Hari</th>
                                    <th>Sesi</th>
                                    <th style={{ width: "1%", whiteSpace: "nowrap" }}>
                                      Detail Sesi
                                    </th>
                                    <th>Kuota</th>
                                    <th style={{ width: "1%", whiteSpace: "nowrap" }}>...</th>
                                  </tr>
                                </thead>

                                {qualificationDays.map((day, dayIndex) => (
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
                                          outline
                                          type="info"
                                          size="sm"
                                          icon="plus-circle"
                                          onClick={() => addSession(dayIndex)}
                                        />{" "}
                                        <Button
                                          outline
                                          type="secondary"
                                          size="sm"
                                          icon={day.openDetails ? "chevron-up" : "chevron-down"}
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
                                                onClick={() =>
                                                  saveSessionItem(dayIndex, detailIndex)
                                                }
                                              />
                                            ) : (
                                              <Button
                                                type="warning"
                                                icon="pencil"
                                                outline
                                                size="sm"
                                                onClick={() =>
                                                  editSessionItem(dayIndex, detailIndex)
                                                }
                                              />
                                            )}{" "}
                                            <Button
                                              type="danger"
                                              icon="trash"
                                              outline
                                              size="sm"
                                              onClick={() =>
                                                removeSessionItem(dayIndex, detailIndex)
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                ))}
                              </table>
                            </div>
                          )}
                          {_.get(errors, "qualificationDaysDetails")?.map((message) => (
                            <div
                              className="mt-2 d-inline-block float-end"
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "#F2F8FF",
                                fontSize: "80%",
                                borderRadius: 4,
                              }}
                              key={message}
                            >
                              <i
                                className="bx bxs-info-circle font-size-18 align-middle me-2"
                                style={{ color: "#0D47A1" }}
                              />
                              <span>{message}</span>
                            </div>
                          ))}
                        </Col>
                      </Row>
                    </React.Fragment>
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

function createSessionData(currentSessions, sessionDuration) {
  let startTime;
  let endTime;

  if (!currentSessions.length) {
    startTime = "00:00";
    endTime = moment()
      .startOf("day")
      .add(Number(sessionDuration) - 1, "minute")
      .format("HH:mm");
  } else {
    const lastSession = currentSessions[currentSessions.length - 1];
    const lastStartTime = lastSession.startTime;
    const lastEndTime = lastSession.endTime;

    startTime = moment()
      .startOf("day")
      .add(lastStartTime, "hour")
      .add(sessionDuration, "minute")
      .format("HH:mm");

    endTime = moment()
      .startOf("day")
      .add(lastEndTime, "hour")
      .add(sessionDuration, "minute")
      .format("HH:mm");
  }

  return { startTime, endTime, openEdit: true, quota: 0 };
}
