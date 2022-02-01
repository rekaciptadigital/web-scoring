import * as React from "react";
import { useParams } from "react-router-dom";
import { useWizardView } from "utils/hooks/wizard-view";
import { schedulingReducer, SCHEDULING_TYPE } from "./hooks/qualification-scheduling-data";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Container, Table } from "reactstrap";
import { WizardView, WizardViewContent, Button, ButtonOutlineBlue } from "components/ma";
import {
  StepsList,
  StepItem,
  FolderTabs,
  TabItem,
  FolderPanel,
  FieldInputDateSmall,
  FieldInputTimeSmall,
  NoticeBarInfo,
  BottomFlashMessage,
} from "./components";
import { BreadcrumbDashboard } from "../components/breadcrumb";

import IconTarget from "components/ma/icons/mono/target";
import IconScoreboard from "components/ma/icons/mono/scoreboard";
import IconBranch from "components/ma/icons/mono/branch";
import IconDiagram from "components/ma/icons/mono/diagram";
import IconCalendar from "components/ma/icons/mono/calendar";

import { parseISO } from "date-fns";
import classnames from "classnames";

import {
  StyledPageWrapper,
  StickyContainer,
  StickyItem,
  StickyItemSibling,
  QualificationScheduleHeader,
  ScheduleGroupFormBox,
  SchedulingFormActions,
} from "./styles";

const stepsList = [
  { step: 1, label: "Atur Kualifikasi" },
  { step: 2, label: "Skor Kualifikasi" },
  { step: 3, label: "Atur Eliminasi" },
  { step: 4, label: "Skor Eliminasi" },
];

const scheduleTabs = [
  { step: 1, label: "Jadwal" },
  { step: 2, label: "Bantalan" },
];

const PageEventDetailSchedulingScoring = () => {
  const { event_id } = useParams();
  const { currentStep, goToStep } = useWizardView(stepsList);

  const [groupedCategoryDetails, setGroupedCategoryDetails] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      status: "idle",
      data: null,
      errors: null,
    }
  );
  const [scheduling, dispatchScheduling] = React.useReducer(schedulingReducer, {
    status: "idle",
    data: null,
    errors: null,
  });
  const [editMode, dispatchEditMode] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      currentId: null,
      status: "closed",
      initialSchedules: null,
      flashMessage: "",
    }
  );
  const [schedulingForm, dispatchShedulingForm] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { isFormDirty: false, errors: {} }
  );

  const eventId = parseInt(event_id);

  const isLoadingCategoryDetails = groupedCategoryDetails.status === "loading";
  const categoryDetailsData = groupedCategoryDetails.data;
  const competitionCategories = groupedCategoryDetails.data
    ? Object.keys(groupedCategoryDetails.data)
    : [];

  const { data: schedulesData } = scheduling;
  const isLoadingSchedules = scheduling.status === "loading";

  const { isFormDirty, errors: validationErrors } = schedulingForm;

  const isEditMode = editMode.status === "open";

  function displayFlashMessage(message) {
    dispatchEditMode({ flashMessage: message });
    setTimeout(() => {
      dispatchEditMode({ flashMessage: "" });
    }, 3000);
  }

  React.useEffect(() => {
    const fetchCategoryDetails = async () => {
      setGroupedCategoryDetails({ status: "loading", errors: null });
      const result = await EventsService.getEventCategoryDetails({ event_id: eventId });
      if (result.success) {
        setGroupedCategoryDetails({ status: "success", data: result.data });
      } else {
        setGroupedCategoryDetails({ status: "error", errors: result.errors });
      }
    };

    fetchCategoryDetails();
  }, []);

  React.useEffect(() => {
    if (!categoryDetailsData) {
      return;
    }

    const fetchScheduling = async () => {
      dispatchScheduling({ status: "loading", errors: null });
      const result = await EventsService.getEventQualificationSchedules({ event_id: eventId });
      if (result.success) {
        dispatchScheduling({
          type: SCHEDULING_TYPE.INIT,
          payload: makeSchedulingData(categoryDetailsData, result.data),
        });
      } else {
        dispatchScheduling({ status: "error", errors: result.errors });
      }
    };

    fetchScheduling();
  }, [categoryDetailsData]);

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
    dispatchShedulingForm({ errors: validationErrors });
    return validationErrors;
  };

  const handleClickSaveSchedule = async () => {
    if (isEditMode) {
      displayFlashMessage("Simpan terlebih dahulu jadwal yang diubah di bawah");
      return;
    }

    if (!isFormDirty) {
      dispatchShedulingForm({ isFormDirty: true });
    }

    // Validate inputs, required
    const validationErrors = runValidation();
    if (Object.keys(validationErrors)?.length) {
      return;
    }

    // TODO: submit
  };

  React.useEffect(() => {
    if (!isFormDirty) {
      return;
    }
    runValidation();
  }, [isFormDirty, schedulesData]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Atur Jadwal dan Skor Pertandingan | MyArchery.id</title>
      </MetaTags>

      <StyledPageWrapper>
        <Container fluid>
          <BreadcrumbDashboard to={`/dashboard/event/${eventId}/home`}>Kembali</BreadcrumbDashboard>

          <StickyContainer>
            <StickyItem>
              <StepsList
                title="Jadwal &amp; Scoring"
                currentStep={currentStep}
                onChange={(step) => goToStep(step)}
              >
                <StepItem step="1" icon={<IconTarget size="20" />}>
                  Atur Kualifikasi
                </StepItem>

                <StepItem step="2" disabled icon={<IconScoreboard size="20" />}>
                  Skor Kualifikasi
                </StepItem>

                <StepItem step="3" disabled icon={<IconBranch size="20" />}>
                  Atur Eliminasi
                </StepItem>

                <StepItem step="4" disabled icon={<IconDiagram size="20" />}>
                  Skor Eliminasi
                </StepItem>
              </StepsList>
            </StickyItem>

            <StickyItemSibling>
              <WizardView currentStep={currentStep}>
                <WizardViewContent>
                  <div>
                    <FolderTabs tabs={scheduleTabs}>
                      <TabItem tab="1" icon={<IconCalendar size="16" />}>
                        Jadwal
                      </TabItem>

                      <TabItem disabled tab="2" icon={<IconCalendar size="16" />}>
                        Bantalan
                      </TabItem>
                    </FolderTabs>

                    <FolderPanel>
                      <QualificationScheduleHeader>
                        <div>
                          <h3>Jadwal Kualifikasi</h3>
                          <div>Pengaturan jadwal tiap kategori</div>
                        </div>

                        <SchedulingFormActions>
                          <Button onClick={handleClickSaveSchedule}>Simpan</Button>
                          {editMode.flashMessage && (
                            <BottomFlashMessage>{editMode.flashMessage}</BottomFlashMessage>
                          )}
                        </SchedulingFormActions>
                      </QualificationScheduleHeader>

                      {categoryDetailsData && (
                        <NoticeBarInfo>
                          Anda tidak dapat mengatur kembali jika terdapat peserta yang telah
                          mendaftar
                        </NoticeBarInfo>
                      )}

                      {isLoadingCategoryDetails ? (
                        <div>Sedang memuat data kategori event</div>
                      ) : isLoadingSchedules ? (
                        <div>Sedang memuat data jadwal kualifikasi</div>
                      ) : competitionCategories.length && schedulesData ? (
                        competitionCategories.map((competition, index) => {
                          const scheduleGroup = schedulesData[competition];
                          const categoryDetails = categoryDetailsData[competition];

                          const shouldAllowEditing =
                            isEditMode && editMode.currentId === competition;

                          const handleOpenEditSchedule = () => {
                            if (isEditMode) {
                              return;
                            }

                            const currentSchedules = { ...scheduleGroup };
                            dispatchEditMode({
                              currentId: competition,
                              status: "open",
                              initialSchedules: currentSchedules,
                            });
                          };

                          const handleCloseEditSchedule = () => {
                            dispatchEditMode({
                              currentId: null,
                              status: "closed",
                              initialSchedules: null,
                              flashMessage: "",
                            });
                          };

                          const handleCancelEditSchedule = (payload) => {
                            dispatchScheduling({
                              type: SCHEDULING_TYPE.BULK,
                              competitionCategory: competition,
                              payload,
                            });
                            handleCloseEditSchedule();
                          };

                          return (
                            <ScheduleGroupFormBox
                              key={index}
                              className={classnames({ "is-focused": shouldAllowEditing })}
                            >
                              <div>
                                <div>
                                  <div
                                    className="d-flex align-items-start justify-content-between mb-4"
                                    style={{ gap: "0.5rem" }}
                                  >
                                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                                      <div style={{ flexBasis: "30%" }}>
                                        <div>Kategori</div>
                                        <h4 className="mt-2">{competition}</h4>
                                      </div>

                                      <div
                                        className="d-flex"
                                        style={{ flexBasis: "70%", gap: "0.5rem" }}
                                      >
                                        <FieldInputDateSmall
                                          label="Tanggal"
                                          disabled={shouldAllowEditing}
                                          value={scheduleGroup.common.date}
                                          onChange={(value) =>
                                            dispatchScheduling({
                                              type: SCHEDULING_TYPE.COMMON,
                                              competitionCategory: competition,
                                              payload: { date: value },
                                            })
                                          }
                                        />
                                        <FieldInputTimeSmall
                                          label="Jam Mulai"
                                          disabled={shouldAllowEditing}
                                          value={scheduleGroup.common.timeStart}
                                          onChange={(value) => {
                                            dispatchScheduling({
                                              type: SCHEDULING_TYPE.COMMON,
                                              competitionCategory: competition,
                                              payload: { timeStart: value },
                                            });
                                          }}
                                        />
                                        <FieldInputTimeSmall
                                          label="Jam Selesai"
                                          disabled={shouldAllowEditing}
                                          value={scheduleGroup.common.timeEnd}
                                          onChange={(value) => {
                                            dispatchScheduling({
                                              type: SCHEDULING_TYPE.COMMON,
                                              competitionCategory: competition,
                                              payload: { timeEnd: value },
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div
                                      className="mt-4 d-flex justify-content-end"
                                      style={{
                                        flexBasis: "40%",
                                        textAlign: "right",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      {shouldAllowEditing ? (
                                        <React.Fragment>
                                          <Button
                                            onClick={() =>
                                              handleCancelEditSchedule(editMode.initialSchedules)
                                            }
                                          >
                                            Batal
                                          </Button>
                                          <ButtonOutlineBlue onClick={handleCloseEditSchedule}>
                                            Simpan
                                          </ButtonOutlineBlue>
                                        </React.Fragment>
                                      ) : (
                                        <ButtonOutlineBlue onClick={handleOpenEditSchedule}>
                                          Ubah Detail
                                        </ButtonOutlineBlue>
                                      )}
                                    </div>
                                  </div>

                                  <Table>
                                    <thead>
                                      <tr>
                                        <th style={{ textTransform: "uppercase" }}>Kelas</th>
                                        <th style={{ textTransform: "uppercase" }}>Jenis Regu</th>
                                        <th style={{ textTransform: "uppercase" }}>Jarak</th>
                                        <th style={{ textTransform: "uppercase" }}>Tanggal</th>
                                        <th style={{ textTransform: "uppercase" }}>
                                          Jam Kualifikasi
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {categoryDetails.map((detail) => {
                                        const {
                                          eventCategoryDetailsId: detailId,
                                          ageCategory,
                                          teamCategory,
                                          distancesCategory,
                                        } = detail;

                                        const schedule = scheduleGroup[detailId];
                                        const fieldNameDate = `schedule-date-${detailId}`;
                                        const fieldNameTimeStart = `schedule-time-start-${detailId}`;
                                        const fieldNameTimeEnd = `schedule-time-end-${detailId}`;

                                        const handleSingleScheduleChange = (payload) => {
                                          dispatchScheduling({
                                            type: SCHEDULING_TYPE.SINGLE,
                                            competitionCategory: competition,
                                            detailId,
                                            payload,
                                          });
                                        };

                                        return (
                                          <tr key={detailId}>
                                            <td>{ageCategory}</td>
                                            <td style={{ textTransform: "capitalize" }}>
                                              {teamCategory}
                                            </td>
                                            <td>{distancesCategory}</td>

                                            <td width="20%">
                                              <div>
                                                <FieldInputDateSmall
                                                  disabled={!shouldAllowEditing}
                                                  name={fieldNameDate}
                                                  value={schedule.date}
                                                  onChange={(value) => {
                                                    handleSingleScheduleChange({
                                                      competitionCategory: competition,
                                                      detailId,
                                                      date: value,
                                                    });
                                                  }}
                                                  errors={validationErrors[fieldNameDate]}
                                                />
                                              </div>
                                            </td>

                                            <td width="30%">
                                              <div className="d-flex" style={{ gap: "0.5rem" }}>
                                                <FieldInputTimeSmall
                                                  disabled={!shouldAllowEditing}
                                                  name={fieldNameTimeStart}
                                                  value={schedule.timeStart}
                                                  onChange={(value) => {
                                                    handleSingleScheduleChange({
                                                      competitionCategory: competition,
                                                      detailId,
                                                      timeStart: value,
                                                    });
                                                  }}
                                                  errors={validationErrors[fieldNameTimeStart]}
                                                />

                                                <FieldInputTimeSmall
                                                  disabled={!shouldAllowEditing}
                                                  name={fieldNameTimeEnd}
                                                  value={schedule.timeEnd}
                                                  onChange={(value) => {
                                                    handleSingleScheduleChange({
                                                      competitionCategory: competition,
                                                      detailId,
                                                      timeEnd: value,
                                                    });
                                                  }}
                                                  errors={validationErrors[fieldNameTimeEnd]}
                                                />
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </ScheduleGroupFormBox>
                          );
                        })
                      ) : (
                        <div>Tidak ditemukan</div>
                      )}
                    </FolderPanel>
                  </div>
                </WizardViewContent>
              </WizardView>
            </StickyItemSibling>
          </StickyContainer>
        </Container>
      </StyledPageWrapper>
    </React.Fragment>
  );
};

function makeSchedulingData(groupedCategoryDetail, schedules) {
  const transformedSchedules = {};
  const makeInitialSchedule = (categoryDetailId) => {
    const emptySchedule = { date: "", timeStart: "", timeEnd: "" };

    if (!categoryDetailId) {
      return emptySchedule;
    }

    const byCategoryDetailId = (schedule) => schedule.categoryDetailId === categoryDetailId;
    const schedule = schedules.find(byCategoryDetailId);
    if (schedule) {
      return {
        date: parseISO(schedule.eventStartDatetime),
        timeStart: parseISO(schedule.eventStartDatetime),
        timeEnd: parseISO(schedule.eventEndDatetime),
      };
    }

    return emptySchedule;
  };

  for (const competitionCategory in groupedCategoryDetail) {
    transformedSchedules[competitionCategory] = {};
    for (const detail of groupedCategoryDetail[competitionCategory]) {
      transformedSchedules[competitionCategory][detail.eventCategoryDetailsId] =
        makeInitialSchedule(detail.eventCategoryDetailsId);
    }
    transformedSchedules[competitionCategory].common = makeInitialSchedule();
  }
  return transformedSchedules;
}

export default PageEventDetailSchedulingScoring;
