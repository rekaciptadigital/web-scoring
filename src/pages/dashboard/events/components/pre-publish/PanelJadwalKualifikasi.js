import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { schedulingReducer, SCHEDULING } from "../../hooks/qualification-scheduling-data";
import { EventsService } from "services";

import { Table } from "reactstrap";
import DatePicker from "react-datepicker";
import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";

import id from "date-fns/locale/id";
import imageIllustrationQualificationSuccess from "assets/images/events/create-event-qualification-schedule-success.png";

function PanelJadwalKualifikasi({ eventId, eventData, onPublishSuccess }) {
  const [groupedCategoryDetails, setGroupedCategoryDetails] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });
  const [scheduling, dispatchScheduling] = React.useReducer(schedulingReducer, { data: null });
  const [submitStatus, setSubmitStatus] = React.useState({ status: "idle", errors: null });

  const isLoadingCategoryDetails = groupedCategoryDetails.status === "loading";
  const categoryDetailsData = groupedCategoryDetails.data;
  const competitionCategories = groupedCategoryDetails.data
    ? Object.keys(groupedCategoryDetails.data)
    : [];

  const { data: schedulesData } = scheduling;

  const isSaveLoading = submitStatus.status === "loading";
  const isSaveSuccess = submitStatus.status === "success";

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

  const handleClickSaveSchedule = () => {
    setSubmitStatus((state) => ({ ...state, status: "loading", errors: null }));
    // TODO: fetch endpoint qualification time/schedule

    // mock process
    setTimeout(() => {
      setSubmitStatus((state) => ({ ...state, status: "success" }));
    }, 1500);
  };

  const handleClickPublish = () => {
    setSubmitStatus((state) => ({ ...state, status: "loading", errors: null }));
    // TODO: 1. fetch endpoint qualification time/schedule
    // TODO: 2. ketika sukses, fetch endpoint update status

    // mock process
    setTimeout(() => {
      onPublishSuccess?.();
    }, 1500);
  };

  React.useEffect(() => {
    if (isSaveSuccess) {
      return;
    }

    const fetchCategoryDetails = async () => {
      setGroupedCategoryDetails((state) => ({ ...state, status: "loading", errors: null }));
      const result = await EventsService.getEventCategoryDetails({ event_id: eventId });
      if (result.success) {
        setGroupedCategoryDetails((state) => ({ ...state, status: "success", data: result.data }));
        dispatchScheduling({
          type: SCHEDULING.INIT,
          payload: makeSchedulingData(result.data, {
            initialDateStart: eventData.publicInformation.eventStart,
            initialDateEnd: eventData.publicInformation.eventEnd,
          }),
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
  }, [isSaveSuccess]);

  if (!isSaveSuccess) {
    return (
      <div>
        <QualificationScheduleHeader>
          <div className="heading-left">
            <h3>Jadwal Kualifikasi</h3>
            <div>Pengaturan jadwal tiap kategori</div>
          </div>

          <div className="buttons-right">
            <Button style={{ color: "var(--ma-blue)" }} onClick={handleClickSaveSchedule}>
              Simpan
            </Button>
            <ButtonBlue onClick={handleClickPublish}>Terapkan</ButtonBlue>
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

  return (
    <div>
      <IllustrationQualificationSuccess />
      <PanelContent>
        <h3>Jadwal Kualifikasi berhasil disimpan</h3>
        <div>
          Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage Event. Buat
          lebih banyak event di Dashboard EO.
        </div>
        <div className="action-buttons">
          <ButtonToDashboardEO />
          <ButtonToManageEvent eventId={eventId} />
        </div>
      </PanelContent>

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
}) {
  const handleCommonScheduleChange = (payload) => {
    onCommonChange?.(payload);
  };

  const handleSingleScheduleChange = (payload) => {
    onSingleChange?.(payload);
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

        <div className="mt-4" style={{ flexBasis: "40%", textAlign: "right" }}>
          <ButtonOutlineBlue>Ubah Detail</ButtonOutlineBlue>
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
              return (
                <tr key={detailId}>
                  <td>{ageCategory}</td>
                  <td style={{ textTransform: "capitalize" }}>{teamCategory}</td>
                  <td>{distancesCategory}</td>

                  <td width="20%">
                    <div>
                      <FieldInputDateSmall
                        disabled={true}
                        value={schedule.date}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            date: value,
                          })
                        }
                      />
                    </div>
                  </td>

                  <td width="30%">
                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                      <FieldInputTimeSmall
                        disabled={true}
                        value={schedule.timeStart}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            timeStart: value,
                          })
                        }
                      />

                      <FieldInputTimeSmall
                        disabled={true}
                        value={schedule.timeEnd}
                        onChange={(value) =>
                          handleSingleScheduleChange({
                            competitionCategory: competition,
                            detailId,
                            timeEnd: value,
                          })
                        }
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

const IllustrationQualificationSuccess = styled.div`
  margin-bottom: 72px;
  width: 100%;
  min-height: 239px;
  background-image: url(${imageIllustrationQualificationSuccess});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
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
        className="field-input-date"
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
    /* font-size: 14px; */
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
    /* font-size: 14px; */
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
        className="field-input-time"
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
  }
`;

const PanelContent = styled.div`
  text-align: center;

  .action-buttons {
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }
`;

function ButtonToDashboardEO() {
  return (
    <Button style={{ color: "var(--ma-blue)" }} as={Link} to="/dashboard">
      Dashboard EO
    </Button>
  );
}

function ButtonToManageEvent({ eventId }) {
  return (
    <ButtonBlue as={Link} to={`/dashboard/event/${eventId}/home`}>
      Manage Event
    </ButtonBlue>
  );
}

function makeSchedulingData(groupedData, { initialDateStart, initialDateEnd }) {
  const transformedSchedules = {};
  const makeInitialSchedule = () => ({
    date: new Date(initialDateStart),
    timeStart: new Date(initialDateStart),
    timeEnd: new Date(initialDateEnd),
  });

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

export default PanelJadwalKualifikasi;
