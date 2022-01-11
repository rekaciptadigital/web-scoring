import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import queryString from "query-string";
import classnames from "classnames";
import { useWizardView } from "utils/hooks/wizard-view";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Container, Row, Col, Table } from "reactstrap";
import DatePicker from "react-datepicker";
import {
  WizardView,
  WizardViewContent,
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
} from "components/ma";

import id from "date-fns/locale/id";

import imageIllustrationSaveSuccess from "assets/images/events/create-event-save-success.png";
import imageIllustrationQualificationSuccess from "assets/images/events/create-event-qualification-schedule-success.png";
import imageIllustrationEventReady from "assets/images/events/create-event-event-ready.png";

const stepsList = [
  {
    step: 1,
    label: "Atur Pertandingan",
    description: "Selamat! Event pertandingan berhasil dipublikasi. Segera atur jadwal kualifikasi",
  },
  {
    step: 2,
    label: "Jadwal Kualifikasi",
    description:
      "Peserta dapat mendaftar pertandingan jika Anda telah mengatur jadwal kualifikasi.",
  },
  {
    step: 3,
    label: "Event Siap",
    description: "Selamat! Event Anda sudah terpublikasi dan peserta dapat mendaftar.",
  },
];

function PagePrePublish() {
  const location = useLocation();
  const { steps, currentStep, goToStep } = useWizardView(stepsList);
  const [eventDetail, setEventDetail] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });

  const { eventId } = queryString.parse(location.search);
  const eventDetailData = eventDetail.data;
  const isLoadingEvent = eventDetail.status === "loading";

  React.useEffect(() => {
    const fetchEvent = async () => {
      setEventDetail((state) => ({ ...state, status: "loading" }));
      const result = await EventsService.getEventDetailById({ id: eventId });
      if (result.success) {
        setEventDetail((state) => ({ ...state, status: "success", data: result.data }));
        const stepToActivate = result.data.status === 0 ? 1 : 2;
        goToStep(stepToActivate);
      } else {
        setEventDetail((state) => ({ ...state, status: "error", errors: result.errors }));
      }
    };

    fetchEvent();
  }, []);

  return (
    <div className="page-content">
      <MetaTags>
        <title>Atur pertandingan | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="my-5">
        {!eventId ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h4>Event tidak valid</h4>
              <div>
                <Button as={Link} to="/dashboard">
                  Kembali ke Dashboard EO
                </Button>
              </div>
            </div>
          </div>
        ) : isLoadingEvent ? (
          <div>Sedang memuat data event...</div>
        ) : eventDetailData ? (
          <Row>
            <Col md="4">
              <CardFlatBasic>
                <h2 className="mt-2 mb-4">Sedikit Lagi</h2>
                <div>
                  {steps.map((step) => (
                    <StepItem
                      key={step.step}
                      className={classnames({ "step-remaining": step.step > currentStep })}
                    >
                      <StepNumbering
                        className={classnames({ "step-active": step.step === currentStep })}
                      >
                        <StepNumber>&#10003;</StepNumber>
                      </StepNumbering>
                      <StepContent>
                        <h5 className="step-heading">{step.label}</h5>
                        <div className="step-description">{step.description}</div>
                      </StepContent>
                    </StepItem>
                  ))}
                </div>
              </CardFlatBasic>
            </Col>

            <Col md="8">
              <WizardView currentStep={currentStep}>
                <WizardViewContent>
                  <div>
                    <IllustrationSaveSuccess />
                    <PanelContent>
                      <h2>Pengaturan Pertandingan berhasil disimpan</h2>
                      <div>
                        Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage
                        Event. Buat lebih banyak event di Dashboard EO.
                      </div>
                      <div className="action-buttons">
                        <ButtonToDashboardEO />
                        <ButtonToManageEvent eventId={eventId} />
                      </div>
                    </PanelContent>
                  </div>
                </WizardViewContent>

                <WizardViewContent>
                  <PanelJadwalKualifikasi
                    eventId={eventId}
                    eventData={eventDetailData}
                  />
                </WizardViewContent>

                <WizardViewContent>
                  <div>
                    <IllustrationEventReady />
                    <PanelContent>
                      <h2>{eventDetailData.eventName} sudah siap!</h2>
                      <div>
                        Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage
                        Event. Buat lebih banyak event di Dashboard EO.
                      </div>
                      <div className="action-buttons">
                        <ButtonToDashboardEO />
                        <ButtonToManageEvent eventId={eventId} />
                      </div>
                    </PanelContent>
                  </div>
                </WizardViewContent>
              </WizardView>
            </Col>
          </Row>
        ) : (
          <div>Gagal memuat data event.</div>
        )}
      </Container>
    </div>
  );
}

function PanelJadwalKualifikasi({ eventId, isSuccess = false }) {
  const [groupedCategoryDetails, setGroupedCategoryDetails] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });

  const isLoadingCategories = groupedCategoryDetails.status === "loading";
  const categoryDetailsByCompetitionCateg = groupedCategoryDetails.data;
  const categoryGroups = groupedCategoryDetails.data
    ? Object.keys(groupedCategoryDetails.data)
    : [];

  React.useEffect(() => {
    if (isSuccess) {
      return;
    }

    const fetchCategoryDetails = async () => {
      setGroupedCategoryDetails((state) => ({ ...state, status: "loading", errors: null }));
      const result = await EventsService.getEventCategoryDetails({ event_id: eventId });
      if (result.success) {
        setGroupedCategoryDetails((state) => ({ ...state, status: "success", data: result.data }));
      } else {
        setGroupedCategoryDetails((state) => ({
          ...state,
          status: "error",
          errors: result.errors,
        }));
      }
    };

    fetchCategoryDetails();
  }, [isSuccess]);

  if (!isSuccess) {
    return (
      <div>
        <QualificationScheduleHeader>
          <div className="heading-left">
            <h3>Jadwal Kualifikasi</h3>
            <div>Pengaturan jadwal tiap kategori</div>
          </div>

          <div className="buttons-right">
            <Button style={{ color: "var(--ma-blue)" }}>Simpan</Button>
            <ButtonBlue>Terapkan</ButtonBlue>
          </div>
        </QualificationScheduleHeader>

        <div>
          {isLoadingCategories ? (
            <CardCategorySchedule>Sedang memuat data kategori event</CardCategorySchedule>
          ) : categoryDetailsByCompetitionCateg && categoryGroups.length ? (
            categoryGroups.map((competitionCategory) => {
              const categoryDetails = categoryDetailsByCompetitionCateg[competitionCategory];
              return (
                <CardCategorySchedule key={competitionCategory}>
                  <div
                    className="d-flex align-items-start justify-content-between mb-4"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                      <div style={{ flexBasis: "30%" }}>
                        <div>Kategori</div>
                        <h4 className="mt-2">{competitionCategory}</h4>
                      </div>

                      <div className="d-flex" style={{ flexBasis: "70%", gap: "0.5rem" }}>
                        <FieldInputDateSmall label="Tanggal" />
                        <FieldInputTimeSmall label="Jam Mulai" />
                        <FieldInputTimeSmall label="Jam Selesai" />
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
                      {categoryDetails.map((categoryDetail) => (
                        <tr key={categoryDetail.eventCategoryDetailsId}>
                          <td>{categoryDetail.ageCategory}</td>
                          <td>{categoryDetail.teamCategory}</td>
                          <td>{categoryDetail.distancesCategory}</td>
                          <td width="20%">
                            <div>
                              <FieldInputDateSmall disabled />
                            </div>
                          </td>
                          <td width="30%">
                            <div className="d-flex" style={{ gap: "0.5rem" }}>
                              <FieldInputTimeSmall disabled />
                              <FieldInputTimeSmall disabled />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardCategorySchedule>
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
    </div>
  );
}

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

const CardFlatBasic = styled.div`
  margin-bottom: 2rem;
  padding: 24px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const CardCategorySchedule = styled(CardFlatBasic)`
  padding: 20px;
`;

const StepItem = styled.div`
  display: flex;

  &:last-of-type > *:first-child {
    border-right: solid 1px transparent;
  }
`;

const StepNumbering = styled.div`
  position: relative;
  flex: 0 0 0.5rem;
  box-sizing: content-box;
  border-right: solid 1px var(--ma-blue-100);

  &.step-active > span {
    transform: scale(1.4);
  }
`;

const StepNumber = styled.span`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 1rem;
  height: 1rem;
  border-radius: 50%;

  background-color: var(--ma-blue);
  color: #ffffff;

  ${StepItem}.step-remaining & {
    background-color: var(--ma-blue-100);
  }
`;

const StepContent = styled.div`
  padding-left: 1.5rem;
  padding-bottom: 2rem;

  .step-heading {
    color: var(--ma-blue);

    ${StepItem}.step-remaining & {
      color: var(--ma-blue-100);
    }
  }

  .step-description {
    color: var(--ma-gray-600);

    ${StepItem}.step-remaining & {
      color: var(--ma-gray-400);
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

const IllustrationSaveSuccess = styled.div`
  margin-bottom: 72px;
  width: 100%;
  min-height: 247px;
  background-image: url(${imageIllustrationSaveSuccess});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
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

const IllustrationEventReady = styled.div`
  margin-bottom: 72px;
  width: 100%;
  min-height: 328px;
  background-image: url(${imageIllustrationEventReady});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
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
    /* font-size: 14px; */
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

export default PagePrePublish;
