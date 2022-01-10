import * as React from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { stringUtil } from "utils";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs } from "constants/index";
import { eventDataReducer } from "../hooks/create-event-data";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import { StepList, WizardView, WizardViewContent, Button, ButtonBlue } from "components/ma";
import {
  StepInfoUmum,
  StepBiaya,
  StepKategori,
  RibbonEventConfig,
} from "../components/new-fullday";
import { PreviewPortal } from "../components/preview";

const stepsData = [
  {
    step: 1,
    label: "Informasi Umum",
    description: "Banner dan informasi mengenai event Anda",
  },
  {
    step: 2,
    label: "Kategori Lomba",
    description: "Pengaturan kategori beserta detailnya",
  },
  {
    step: 3,
    label: "Biaya Registrasi",
    description: "Pengaturan biaya pendaftaran pertandingan",
  },
];

const { EVENT_TYPES, MATCH_TYPES, PUBLICATION_TYPES } = eventConfigs;

const TEAM_INDIVIDUAL = "individual";
const TEAM_INDIVIDUAL_MALE = "individualMale";
const TEAM_INDIVIDUAL_FEMALE = "individualFemale";
const TEAM_MALE = "maleTeam";
const TEAM_FEMALE = "femaleTeam";
const TEAM_MIXED = "mixedTeam";

const initialEventCategoryKey = stringUtil.createRandom();
const initialDetailKey = stringUtil.createRandom();
const initialEventData = {
  eventType: EVENT_TYPES.FULLDAY,
  eventCompetition: MATCH_TYPES.TOURNAMENT,
  eventName: "",
  description: "",
  location: "",
  locationType: "",
  city: "",
  extraInfos: [],
  eventCategories: [
    {
      key: initialEventCategoryKey,
      competitionCategory: null,
      categoryDetails: [
        {
          key: initialDetailKey,
          categoryKey: initialEventCategoryKey,
          competitionCategory: "",
          ageCategory: null,
          teamCategory: null,
          distance: [],
          quota: "",
        },
      ],
    },
  ],
  isFlatRegistrationFee: true,
  registrationFee: "",
  registrationFees: [
    { key: 1, teamCategory: TEAM_INDIVIDUAL, amount: "" },
    { key: 2, teamCategory: TEAM_MALE, amount: "" },
    { key: 3, teamCategory: TEAM_FEMALE, amount: "" },
    { key: 4, teamCategory: TEAM_MIXED, amount: "" },
  ],
};

const EventsNewFullday = () => {
  const history = useHistory();
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);
  const [eventData, updateEventData] = React.useReducer(eventDataReducer, initialEventData);
  const [savingEventStatus, setSavingEventStatus] = React.useState({ status: "idle", error: null });
  const [shouldShowPreview, setShouldShowPreview] = React.useState(false);

  const isLoading = savingEventStatus.status === "loading";

  // CREATE DRAFT
  const handleSaveEvent = async () => {
    setSavingEventStatus((state) => ({ ...state, status: "loading" }));

    const payload = await makeEventPayload(eventData, { status: PUBLICATION_TYPES.DRAFT });
    const result = await EventsService.register(payload);
    if (result.success) {
      setSavingEventStatus((state) => ({ ...state, status: "success" }));
      const eventId = result.data?.id;
      eventId && history.push(`/dashboard/events/new/prepublish?eventId=${eventId}`);
    } else {
      setSavingEventStatus((state) => ({ ...state, status: "error" }));
      // TODO: popup error 422
    }
  };

  const handlePublishEvent = async () => {
    setSavingEventStatus((state) => ({ ...state, status: "loading" }));

    const payload = await makeEventPayload(eventData, { status: PUBLICATION_TYPES.PUBLISHED });
    const result = await EventsService.register(payload);
    if (result.success) {
      setSavingEventStatus((state) => ({ ...state, status: "success" }));
      const eventId = result.data?.id;
      eventId && history.push(`/dashboard/events/new/prepublish?eventId=${eventId}`);
    } else {
      setSavingEventStatus((state) => ({ ...state, status: "error" }));
      // TODO: popup error 422
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <React.Fragment>
      <div style={{ marginTop: 133 }}>
        <RibbonEventConfig />
      </div>

      <div className="page-content" style={{ marginTop: 0 }}>
        <MetaTags>
          <title>Registrasi Event Baru | MyArchery.id</title>
        </MetaTags>

        <Container fluid>
          <Row>
            <Col md="3">
              <StepList
                steps={steps}
                currentStep={currentStep}
                onChange={(ev) => goToStep(ev.target.value)}
              >
                Pertandingan
              </StepList>
            </Col>

            <Col lg="9" className="d-flex flex-column">
              <Row>
                <Col>
                  <h2>{currentLabel}</h2>
                  <p>{steps[currentStep - 1].description}</p>
                </Col>
              </Row>

              <div className="content-scrollable flex-grow-1 mb-5">
                <div className="content-scrollable-inner">
                  <WizardView currentStep={currentStep}>
                    <WizardViewContent>
                      <StepInfoUmum eventData={eventData} updateEventData={updateEventData} />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepKategori eventData={eventData} updateEventData={updateEventData} />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepBiaya eventData={eventData} updateEventData={updateEventData} />
                    </WizardViewContent>
                  </WizardView>

                  {currentStep < stepsTotal && (
                    <div
                      className="mx-auto d-flex justify-content-around align-items-center flex-wrap"
                      style={{ color: "#0D47A1", maxWidth: "300px" }}
                    >
                      {currentStep > 1 && (
                        <a onClick={() => goToPreviousStep()}>
                          <i className="mdi mdi-chevron-up" />
                          <span className="ms-1">
                            {stepsData.find((step) => step.step === currentStep - 1).label}
                          </span>
                        </a>
                      )}

                      {currentStep < stepsTotal && (
                        <a onClick={() => goToNextStep()}>
                          <i className="mdi mdi-chevron-down" />
                          <span className="ms-1">
                            {stepsData.find((step) => step.step === currentStep + 1).label}
                          </span>
                        </a>
                      )}
                    </div>
                  )}

                  {currentStep === stepsTotal && (
                    <div className="d-flex justify-content-end" style={{ gap: "1rem" }}>
                      <Button
                        corner="8"
                        onClick={() => goToPreviousStep()}
                        style={{ color: "var(--ma-blue)", width: 100 }}
                      >
                        Kembali
                      </Button>

                      <ButtonBlue
                        corner="8"
                        style={{ width: 100 }}
                        onClick={() => setShouldShowPreview(true)}
                      >
                        Pratinjau
                      </ButtonBlue>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <PreviewPortal
        isActive={shouldShowPreview}
        isLoading={isLoading}
        eventData={eventData}
        onClose={() => setShouldShowPreview(false)}
        onSave={handleSaveEvent}
        onPublish={handlePublishEvent}
      />
    </React.Fragment>
  );
};

function formatServerDatetime(date, time) {
  const dateString = format(date, "yyyy-MM-dd");
  const timeString = format(time, "HH-mm-ss");
  return `${dateString} ${timeString}`;
}

async function imageToBase64(imageFileRaw) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

async function makeEventPayload(eventData, options) {
  const bannerImageBase64 = eventData.bannerImage?.raw
    ? await imageToBase64(eventData.bannerImage.raw)
    : undefined;

  const generatedCategories = makeEventCategories(eventData.eventCategories);
  const categoriesWithFees = makeCategoryFees(eventData, generatedCategories);

  return {
    status: options.status || PUBLICATION_TYPES.DRAFT,
    eventType: eventData.eventType,
    eventCompetition: eventData.eventCompetition,
    publicInformation: {
      eventName: eventData.eventName,
      eventBanner: bannerImageBase64,
      eventDescription: eventData.description,
      eventLocation: eventData.location,
      eventCity: eventData.city?.value,
      eventLocation_type: eventData.locationType,
      eventStart_register: formatServerDatetime(
        eventData.registrationDateStart,
        eventData.registrationTimeStart
      ),
      eventEnd_register: formatServerDatetime(
        eventData.registrationDateEnd,
        eventData.registrationTimeEnd
      ),
      eventStart: formatServerDatetime(eventData.eventDateStart, eventData.eventTimeStart),
      eventEnd: formatServerDatetime(eventData.eventDateEnd, eventData.eventTimeEnd),
    },
    more_information: eventData.extraInfos.map((info) => ({
      title: info.title,
      description: info.description,
    })),
    event_categories: categoriesWithFees,
  };
}

function makeEventCategories(categoriesData) {
  const generatedCategories = [];

  categoriesData.forEach((competition) => {
    competition.categoryDetails?.forEach((detail) => {
      detail.distance?.forEach((distanceItem) => {
        const newCategory = {
          competition_category_id: competition.competitionCategory?.value,
          age_category_id: detail.ageCategory?.value,
          distance_id: distanceItem.value,
          quota: detail.quota,
          team_category_id: undefined,
        };

        if (detail.teamCategory?.value === "Individu Putra") {
          newCategory.team_category_id = TEAM_INDIVIDUAL_MALE;
        } else if (detail.teamCategory?.value === "Individu Putri") {
          newCategory.team_category_id = TEAM_INDIVIDUAL_FEMALE;
        } else if (detail.teamCategory?.value === "Beregu Putra") {
          newCategory.team_category_id = TEAM_MALE;
        } else if (detail.teamCategory?.value === "Beregu Putri") {
          newCategory.team_category_id = TEAM_FEMALE;
        } else if (detail.teamCategory?.value === "Beregu Campuran") {
          newCategory.team_category_id = TEAM_MIXED;
        }

        generatedCategories.push(newCategory);
      });
    });
  });

  return generatedCategories;
}

function makeCategoryFees(eventData, categoriesData) {
  if (eventData.isFlatRegistrationFee) {
    return categoriesData.map((category) => ({ ...category, fee: eventData.registrationFee || 0 }));
  }

  const categoriesWithTeamFees = categoriesData.map((category) => {
    const targetTeamCategory =
      category.team_category_id === TEAM_INDIVIDUAL_MALE ||
      category.team_category_id === TEAM_INDIVIDUAL_FEMALE
        ? TEAM_INDIVIDUAL
        : category.team_category_id;

    const feeItem = eventData.registrationFees.find(
      (fee) => fee.teamCategory === targetTeamCategory
    );
    return { ...category, fee: feeItem?.amount || 0 };
  });

  return categoriesWithTeamFees;
}

export default EventsNewFullday;
