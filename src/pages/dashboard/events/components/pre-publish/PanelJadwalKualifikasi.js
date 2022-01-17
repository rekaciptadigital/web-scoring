import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import { schedulingReducer, SCHEDULING } from "../../hooks/qualification-scheduling-data";
import { EventsService } from "services";

import { Table } from "reactstrap";
import DatePicker from "react-datepicker";
import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";

import id from "date-fns/locale/id";
import classnames from "classnames";

function PanelJadwalKualifikasi({ eventId, onPublishSuccess }) {
  const [groupedCategoryDetails, setGroupedCategoryDetails] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });
  const [scheduling, dispatchScheduling] = React.useReducer(schedulingReducer, { data: null });
  const [submitStatus, setSubmitStatus] = React.useState({ status: "idle", errors: null });
  const [isFormDirty, setIsFormDirty] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});

  const isLoadingCategoryDetails = groupedCategoryDetails.status === "loading";
  const categoryDetailsData = groupedCategoryDetails.data;
  const competitionCategories = groupedCategoryDetails.data
    ? Object.keys(groupedCategoryDetails.data)
    : [];

  const { data: schedulesData } = scheduling;

  const isSaveLoading = submitStatus.status === "loading";

  const updateCommonSchedule = ({ competitionCategory, ...payload }) => {
    dispatchScheduling({
      type: SCHEDULING.COMMON,
      competitionCategory,
      payload,
    });
  };

  const updateSingleSchedule = ({ competitionCategory, detailId, ...payload }) => {
    dispatchScheduling({
      type: SCHEDULING.SINGLE,
      competitionCategory,
      detailId,
      payload,
    });
  };

  const updateBulkSchedules = ({ competitionCategory, payload }) => {
    dispatchScheduling({
      type: SCHEDULING.BULK,
      competitionCategory,
      payload,
    });
  };

  const runValidation = () => {
    const validationErrors = {};
    for (const competitionGroup in schedulesData) {
      const schedules = schedulesData[competitionGroup];
      for (const scheduleId in schedules) {
        if (scheduleId === "common") {
          continue;
        }
        const schedule = schedules[scheduleId];
        if (!schedule.date) {
          validationErrors[`schedule-date-${scheduleId}`] = ["required"];
        }
        if (!schedule.timeStart) {
          validationErrors[`schedule-time-start-${scheduleId}`] = ["required"];
        }
        if (!schedule.timeEnd) {
          validationErrors[`schedule-time-end-${scheduleId}`] = ["required"];
        }
      }
    }
    setValidationErrors(validationErrors);
    return validationErrors;
  };

  const handleClickSaveSchedule = async () => {
    if (!isFormDirty) {
      setIsFormDirty(true);
    }

    // Validate inputs, required
    const validationErrors = runValidation();
    if (Object.keys(validationErrors)?.length) {
      return;
    }

    setSubmitStatus((state) => ({ ...state, status: "loading", errors: null }));
    const payload = makeSchedulesPayload(schedulesData);
    const result = await EventsService.storeQualificationSchedules(payload);
    if (result.success) {
      setSubmitStatus((state) => ({ ...state, status: "success" }));
      onPublishSuccess?.();
    } else {
      setSubmitStatus((state) => ({ ...state, status: "error", errors: result.errors }));
    }
  };

  React.useEffect(() => {
    const fetchCategoryDetails = async () => {
      setGroupedCategoryDetails((state) => ({ ...state, status: "loading", errors: null }));
      const result = await EventsService.getEventCategoryDetails({ event_id: eventId });
      if (result.success) {
        setGroupedCategoryDetails((state) => ({ ...state, status: "success", data: result.data }));
        dispatchScheduling({
          type: SCHEDULING.INIT,
          payload: makeSchedulingData(result.data),
        });
      } else {
        setGroupedCategoryDetails((state) => ({
          ...state,
          status: "error",
          errors: result.errors,
        }));
      }
    };

    fetchCategoryDetails();
  }, []);

  React.useEffect(() => {
    if (!isFormDirty) {
      return;
    }
    runValidation();
  }, [isFormDirty, schedulesData]);

  return (
    <div>
      <QualificationScheduleHeader>
        <div className="heading-left">
          <h3>Jadwal Kualifikasi</h3>
          <div>Pengaturan jadwal tiap kategori</div>
        </div>

        <div className="buttons-right">
          <ButtonBlue onClick={handleClickSaveSchedule}>Simpan</ButtonBlue>
        </div>
      </QualificationScheduleHeader>

      <div>
        {isLoadingCategoryDetails ? (
          <CardCategorySchedule>Sedang memuat data kategori event</CardCategorySchedule>
        ) : categoryDetailsData && competitionCategories.length && schedulesData ? (
          competitionCategories.map((competition) => {
            return (
              <CategoryScheduleEditor
                key={competition}
                competition={competition}
                categoryDetails={categoryDetailsData[competition]}
                scheduleGroup={schedulesData[competition]}
                onCommonChange={updateCommonSchedule}
                onSingleChange={updateSingleSchedule}
                onCancelEdit={updateBulkSchedules}
                validationErrors={validationErrors}
              />
            );
          })
        ) : (
          <CardCategorySchedule>
            <div>Kategori event tidak tersedia.</div>
            <div className="mt-2">
              <Button as={Link} to="/dashboard">
                Kembali ke Dashboard EO
              </Button>
            </div>
          </CardCategorySchedule>
        )}
      </div>

      <LoadingScreen loading={isSaveLoading} />
    </div>
  );
}

function CategoryScheduleEditor({
  competition,
  categoryDetails,
  scheduleGroup,
  onCommonChange,
  onSingleChange,
  onCancelEdit,
  validationErrors,
}) {
  const [editMode, setEditMode] = React.useState({ status: "closed", initialSchedules: null });

  const isEditMode = editMode.status === "open";

  const handleCommonScheduleChange = (payload) => {
    onCommonChange?.(payload);
  };

  const handleSingleScheduleChange = (payload) => {
    onSingleChange?.(payload);
  };

  const handleOpenEditSchedule = () => {
    const currentSchedules = { ...scheduleGroup };
    setEditMode((state) => ({
      ...state,
      status: "open",
      initialSchedules: currentSchedules,
    }));
  };

  const handleCloseEditSchedule = () => {
    setEditMode((state) => ({
      ...state,
      status: "closed",
      initialSchedules: null,
    }));
  };

  const handleCancelEditSchedule = (payload) => {
    onCancelEdit?.(payload);
    handleCloseEditSchedule();
  };

  return (
    <CardCategorySchedule>
      <div
        className="d-flex align-items-start justify-content-between mb-4"
        style={{ gap: "0.5rem" }}
      >
        <div className="d-flex" style={{ gap: "0.5rem" }}>
          <div style={{ flexBasis: "30%" }}>
            <div>Kategori</div>
            <h4 className="mt-2">{competition}</h4>
          </div>

          <div className="d-flex" style={{ flexBasis: "70%", gap: "0.5rem" }}>
            <FieldInputDateSmall
              label="Tanggal"
              value={scheduleGroup.common.date}
              onChange={(value) =>
                handleCommonScheduleChange({
                  competitionCategory: competition,
                  date: value,
                })
              }
            />
            <FieldInputTimeSmall
              label="Jam Mulai"
              value={scheduleGroup.common.timeStart}
              onChange={(value) =>
                handleCommonScheduleChange({
                  competitionCategory: competition,
                  timeStart: value,
                })
              }
            />
            <FieldInputTimeSmall
              label="Jam Selesai"
              value={scheduleGroup.common.timeEnd}
              onChange={(value) =>
                handleCommonScheduleChange({
                  competitionCategory: competition,
                  timeEnd: value,
                })
              }
            />
          </div>
        </div>

        <div
          className="mt-4 d-flex justify-content-end"
          style={{ flexBasis: "40%", textAlign: "right", gap: "0.5rem" }}
        >
          {isEditMode ? (
            <React.Fragment>
              <Button
                style={{ color: "var(--ma-blue)" }}
                onClick={() =>
                  handleCancelEditSchedule({
                    competitionCategory: competition,
                    payload: editMode.initialSchedules,
                  })
                }
              >
                Batal
              </Button>
              <ButtonOutlineBlue onClick={handleCloseEditSchedule}>Simpan</ButtonOutlineBlue>
            </React.Fragment>
          ) : (
            <ButtonOutlineBlue onClick={handleOpenEditSchedule}>Ubah Detail</ButtonOutlineBlue>
          )}
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Kelas</th>
            <th>Jenis Regu</th>
            <th>Jarak</th>
            <th>Tanggal</th>
            <th>Jam Kualifikasi</th>
          </tr>
        </thead>

        <tbody>
          {categoryDetails.map(
            ({
              eventCategoryDetailsId: detailId,
              ageCategory,
              teamCategory,
              distancesCategory,
            }) => {
              const schedule = scheduleGroup[detailId];
              const fieldNameDate = `schedule-date-${detailId}`;
              const fieldNameTimeStart = `schedule-time-start-${detailId}`;
              const fieldNameTimeEnd = `schedule-time-end-${detailId}`;
              return (
                <tr key={detailId}>
                  <td>{ageCategory}</td>
                  <td style={{ textTransform: "capitalize" }}>{teamCategory}</td>
                  <td>{distancesCategory}</td>

                  <td width="20%">
                    <div>
                      <FieldInputDateSmall
                        disabled={!isEditMode}
                        name={fieldNameDate}
                        value={schedule.date}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            date: value,
                          })
                        }
                        errors={validationErrors[fieldNameDate]}
                      />
                    </div>
                  </td>

                  <td width="30%">
                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                      <FieldInputTimeSmall
                        disabled={!isEditMode}
                        name={fieldNameTimeStart}
                        value={schedule.timeStart}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            timeStart: value,
                          })
                        }
                        errors={validationErrors[fieldNameTimeStart]}
                      />

                      <FieldInputTimeSmall
                        disabled={!isEditMode}
                        name={fieldNameTimeEnd}
                        value={schedule.timeEnd}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            timeEnd: value,
                          })
                        }
                        errors={validationErrors[fieldNameTimeEnd]}
                      />
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    </CardCategorySchedule>
  );
}

const CardFlatBasic = styled.div`
  margin-bottom: 2rem;
  padding: 24px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const CardCategorySchedule = styled(CardFlatBasic)`
  padding: 20px;
`;

const QualificationScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .heading-left {
    flex-grow: 1;
  }

  .buttons-right {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

function FieldInputDateSmall({
  children,
  label,
  required,
  name,
  placeholder = "DD/MM/YYYY",
  value,
  onChange,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputDateWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames("field-input-date", { "error-invalid": errors?.length })}
        id={fieldID}
        name={name}
        selected={value}
        onChange={(date) => onChange?.(date)}
        placeholderText={placeholder}
        locale={id}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
      />
    </FieldInputDateWrapper>
  );
}

const FieldInputDateWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-date {
    display: block;
    width: 100%;
    padding: 8px 12px;
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

    &.error-invalid {
      border-color: var(--ma-red);
    }
  }
`;

function FieldInputTimeSmall({
  children,
  label,
  required,
  name,
  placeholder = "00:00",
  value,
  onChange,
  interval,
  disabled,
  errors,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputTimeWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames("field-input-time", { "error-invalid": errors?.length })}
        id={fieldID}
        name={name}
        selected={value}
        onChange={(date) => onChange?.(date)}
        placeholderText={placeholder}
        locale={id}
        timeFormat="H:mm"
        dateFormat="H:mm"
        timeIntervals={interval || 15}
        timeCaption="Pukul"
        showTimeSelect
        showTimeSelectOnly
        disabled={disabled}
      />
    </FieldInputTimeWrapper>
  );
}

const FieldInputTimeWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-time {
    display: block;
    width: 100%;
    padding: 8px 12px;
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

    &.error-invalid {
      border-color: var(--ma-red);
    }
  }
`;

function makeSchedulingData(groupedData) {
  const transformedSchedules = {};
  const makeInitialSchedule = () => ({ date: "", timeStart: "", timeEnd: "" });

  for (const competitionCategory in groupedData) {
    transformedSchedules[competitionCategory] = {};
    for (const detail of groupedData[competitionCategory]) {
      transformedSchedules[competitionCategory][detail.eventCategoryDetailsId] =
        makeInitialSchedule();
    }
    transformedSchedules[competitionCategory].common = makeInitialSchedule();
  }
  return transformedSchedules;
}

function makeSchedulesPayload(schedules) {
  const qualificationTime = [];
  for (const competitionCategory in schedules) {
    const scheduleGroup = schedules[competitionCategory];
    for (const detailId in scheduleGroup) {
      if (detailId === "common") {
        continue;
      }
      const schedule = scheduleGroup[detailId];
      const schedulePayloadItem = {
        category_detail_id: detailId,
        event_start_datetime: formatServerDatetime(schedule.date, schedule.timeStart),
        event_end_datetime: formatServerDatetime(schedule.date, schedule.timeEnd),
      };
      qualificationTime.push(schedulePayloadItem);
    }
  }
  return { qualificationTime };
}

function formatServerDatetime(date, time) {
  const dateString = format(date, "yyyy-MM-dd");
  const timeString = format(time, "HH:mm:ss");
  return `${dateString} ${timeString}`;
}

export default PanelJadwalKualifikasi;
