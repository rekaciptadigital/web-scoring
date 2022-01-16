import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { stringUtil } from "utils";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs, eventCategories } from "constants/index";
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
} from "../components/manage-fullday";
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

const { EVENT_TYPES, MATCH_TYPES } = eventConfigs;
const { TEAM_CATEGORIES } = eventCategories;

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
    { key: 1, teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL, amount: "" },
    { key: 2, teamCategory: TEAM_CATEGORIES.TEAM_MALE, amount: "" },
    { key: 3, teamCategory: TEAM_CATEGORIES.TEAM_FEMALE, amount: "" },
    { key: 4, teamCategory: TEAM_CATEGORIES.TEAM_MIXED, amount: "" },
  ],
};

const PageEventDetailManage = () => {
  const history = useHistory();
  const { event_id } = useParams();
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);
  const [eventData, updateEventData] = React.useReducer(eventDataReducer, initialEventData);
  const [isEventPublished, setIsEventPublished] = React.useState(true);
  const [fetchingEventStatus, setFetchingEventStatus] = React.useState({
    status: "idle",
    errors: null,
    attemptCounts: 0,
  });
  const [savingEventStatus, setSavingEventStatus] = React.useState({
    status: "idle",
    errors: null,
  });
  const [shouldShowPreview, setShouldShowPreview] = React.useState(false);

  const isLoading = savingEventStatus.status === "loading";

  const incrementAttemptCounts = () => {
    setFetchingEventStatus((state) => ({
      ...state,
      attemptCounts: state.attemptCounts + 1,
    }));
  };

  const handleClickSave = async (stepNumber) => {
    if (stepNumber === 1) {
      handleSaveEventDetails();
    } else if (stepNumber === 2) {
      handleSaveCategoryDetails();
    } else if (stepNumber === 3) {
      handleSaveRegistrationFees();
    }
  };

  const handleSaveEventDetails = async () => {
    setSavingEventStatus((state) => ({ ...state, status: "loading", errors: null }));
    const payload = await makeEventDetailsPayload({ event_id, ...eventData });
    const result = await EventsService.updateEvent(payload);
    if (result.success) {
      setSavingEventStatus((state) => ({ ...state, status: "success" }));
      incrementAttemptCounts();
    } else {
      setSavingEventStatus((state) => ({ ...state, status: "error" }));
    }
  };

  const handleSaveCategoryDetails = async () => {
    setSavingEventStatus((state) => ({ ...state, status: "loading", errors: null }));
    const payload = makeCategoryDetailsPayload({ event_id, ...eventData });
    const result = await EventsService.updateCategoryDetails(payload);
    if (result.success) {
      setSavingEventStatus((state) => ({ ...state, status: "success" }));
      incrementAttemptCounts();
    } else {
      setSavingEventStatus((state) => ({ ...state, status: "error" }));
    }
  };

  const handleSaveRegistrationFees = async () => {
    // Validate empty fields
    if (eventData.isFlatRegistrationFee && !eventData.registrationFee) {
      // TODO: ganti pakai sweet alert?
      alert("inputan harga flat masih kosong");
      return;
    }
    if (!eventData.isFlatRegistrationFee && !eventData.registrationFees?.length) {
      // TODO: ganti pakai sweet alert?
      alert("inputan harga per tim masih kosong");
      return;
    }

    setSavingEventStatus((state) => ({ ...state, status: "loading", errors: null }));
    const payload = makeFeesPayload({ event_id, ...eventData });
    const result = await EventsService.updateCategoryFee(payload);
    if (result.success) {
      setSavingEventStatus((state) => ({ ...state, status: "success" }));
      incrementAttemptCounts();
    } else {
      setSavingEventStatus((state) => ({ ...state, status: "error" }));
    }
  };

  const handlePublishEdit = () => {
    alert("Publikasi, yakin?");
  };

  const handlePublishEvent = async () => {
    setSavingEventStatus((state) => ({ ...state, status: "loading", errors: null }));

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
    const getEventDetail = async () => {
      setFetchingEventStatus((state) => ({ ...state, status: "loading", errors: null }));
      const result = await EventsService.getEventDetailById({ id: event_id });
      if (result.success) {
        setFetchingEventStatus((state) => ({ ...state, status: "success" }));
        const eventDetailData = makeEventDetailState(result.data);
        updateEventData(eventDetailData);
        setIsEventPublished(Boolean(result.data.publicInformation.eventStatus));
      } else {
        setFetchingEventStatus((state) => ({ ...state, status: "error", errors: result.errors }));
      }
    };
    getEventDetail();
  }, [fetchingEventStatus.attemptCounts]);

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
          <title>Buat Event Baru | MyArchery.id</title>
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
                  <div className="d-flex justify-content-between">
                    <div>
                      <h2>{currentLabel}</h2>
                      <p>{steps[currentStep - 1].description}</p>
                    </div>

                    <div>
                      <div className="d-flex justify-content-end" style={{ gap: "0.5rem" }}>
                        <Button
                          style={{ color: "var(--ma-blue)" }}
                          onClick={() => handleClickSave(currentStep)}
                        >
                          Simpan
                        </Button>
                        {!isEventPublished && (
                          <ButtonBlue onClick={handlePublishEdit}>Publikasi</ButtonBlue>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="content-scrollable flex-grow-1 mb-5">
                <div className="content-scrollable-inner">
                  <WizardView currentStep={currentStep}>
                    <WizardViewContent>
                      <StepInfoUmum
                        fetchingStatus={savingEventStatus}
                        eventData={eventData}
                        updateEventData={updateEventData}
                      />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepKategori
                        savingStatus={savingEventStatus}
                        eventData={eventData}
                        updateEventData={updateEventData}
                      />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepBiaya
                        fetchingStatus={savingEventStatus}
                        eventData={eventData}
                        updateEventData={updateEventData}
                      />
                    </WizardViewContent>
                  </WizardView>

                  {currentStep <= stepsTotal && (
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
        onPublish={handlePublishEvent}
      />
    </React.Fragment>
  );
};

function makeEventDetailState(initialData) {
  const { publicInformation, moreInformation, eventCategories } = initialData;

  const eventCategoriesState = makeCategoryDetailState(eventCategories);
  const feesState = makeRegistrationFeesState(eventCategories);
  const { isFlatRegistrationFee, registrationFee, registrationFees } = feesState;

  return {
    eventName: publicInformation.eventName,
    bannerImage: { originalUrl: publicInformation.eventBanner, raw: null, preview: null },
    description: publicInformation.eventDescription,
    location: publicInformation.eventLocation,
    locationType: publicInformation.eventLocationType,
    city: {
      label: publicInformation.eventCity.nameCity,
      value: publicInformation.eventCity.cityId,
    },
    registrationDateStart: parseISO("2022-02-10"),
    registrationTimeStart: parseISO("2022-02-10 16:46"),
    registrationDateEnd: parseISO("2022-03-11"),
    registrationTimeEnd: parseISO("2022-03-11 18:32"),
    eventDateStart: parseISO("2022-03-12"),
    eventTimeStart: parseISO("2022-03-12 13:55"),
    eventDateEnd: parseISO("2022-03-12"),
    eventTimeEnd: parseISO("2022-03-12 17:07"),
    extraInfos: moreInformation.map((info) => ({
      key: stringUtil.createRandom(),
      eventId: info.eventId,
      title: info.title,
      description: info.description,
    })),
    eventCategories: eventCategoriesState,
    isFlatRegistrationFee,
    registrationFee,
    registrationFees,
  };
}

function makeCategoryDetailState(categoryDetailData) {
  const sortedCategoryDetail = categoryDetailData.sort((a, b) => {
    if (a.categoryDetailsId === b.categoryDetailsId) {
      return 0;
    }
    if (a.categoryDetailsId < b.categoryDetailsId) {
      return -1;
    }
    return 1;
  });

  const groupedCategoryDetail = {};
  for (const detail of sortedCategoryDetail) {
    const { competitionCategoryId } = detail;
    if (!groupedCategoryDetail[competitionCategoryId.label]) {
      groupedCategoryDetail[competitionCategoryId.label] = [];
    }
    groupedCategoryDetail[competitionCategoryId.label].push(detail);
  }

  const eventCategories = [];
  for (const competitionCategoryId in groupedCategoryDetail) {
    const eventCategoryKey = stringUtil.createRandom();
    const competitionGroup = {
      key: eventCategoryKey,
      competitionCategory: { label: competitionCategoryId, value: competitionCategoryId },
      categoryDetails: groupedCategoryDetail[competitionCategoryId].map((detail) => ({
        key: stringUtil.createRandom(),
        categoryDetailsId: detail.categoryDetailsId,
        categoryKey: eventCategoryKey,
        competitionCategory: detail.competitionCategoryId,
        ageCategory: { value: detail.ageCategoryId.id, label: detail.ageCategoryId.label },
        teamCategory: { value: detail.teamCategoryId.id, label: detail.teamCategoryId.label },
        distance: { value: detail.distanceId.id, label: detail.distanceId.label },
        quota: detail.quota,
        fee: Number(detail.fee),
      })),
    };
    eventCategories.push(competitionGroup);
  }

  return eventCategories;
}

function makeRegistrationFeesState(eventCategories) {
  const registrationFees = [];
  const uniqueTeams = new Set();
  const uniqueFees = new Set();

  for (const category of eventCategories) {
    if (registrationFees.length >= 4) {
      break;
    }

    const targetTeam =
      category.teamCategoryId.id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
      category.teamCategoryId.id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE
        ? TEAM_CATEGORIES.TEAM_INDIVIDUAL
        : category.teamCategoryId.id;

    if (!uniqueTeams.has(targetTeam)) {
      uniqueTeams.add(targetTeam);
      uniqueFees.add(Number(category.fee));
      registrationFees.push({ teamCategory: targetTeam, amount: Number(category.fee) });
    }
  }

  const isFlatRegistrationFee = uniqueFees.size === 1;
  const registrationFee = isFlatRegistrationFee ? [...uniqueFees][0] : "";

  return {
    isFlatRegistrationFee,
    registrationFee,
    registrationFees: isFlatRegistrationFee ? [] : registrationFees,
  };
}

async function makeEventDetailsPayload(eventData) {
  const bannerImageBase64 = eventData.bannerImage?.raw
    ? await imageToBase64(eventData.bannerImage.raw)
    : undefined;

  return {
    id: eventData.event_id,
    eventType: "Full_day",
    eventCompetition: "Tournament",
    status: 0, // status ketika save harus tetep `0` (draft)
    eventName: eventData.eventName,
    eventBanner: bannerImageBase64, // harus opsional
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
  };
}

function makeCategoryDetailsPayload(eventData) {
  const { eventCategories } = eventData;

  const generatedCategories = [];
  eventCategories.forEach((competition) => {
    competition.categoryDetails?.forEach((detail) => {
      const newCategory = {
        event_id: eventData.event_id,
        id: detail.categoryDetailsId,
        competition_category_id: competition.competitionCategory?.value,
        age_category_id: detail.ageCategory?.value,
        distance_id: detail.distance.value,
        quota: detail.quota,
        team_category_id: detail.teamCategory?.value,
        fee: detail.fee, // harusnya opsional, disertakan aja biar gak error 500 dari server
      };
      generatedCategories.push(newCategory);
    });
  });

  return { data: generatedCategories };
}

function makeFeesPayload(eventData) {
  if (eventData.isFlatRegistrationFee) {
    const teamCategories = [
      TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE,
      TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE,
      TEAM_CATEGORIES.TEAM_MALE,
      TEAM_CATEGORIES.TEAM_FEMALE,
      TEAM_CATEGORIES.TEAM_MIXED,
    ];

    return {
      event_id: eventData.event_id,
      data: teamCategories.map((teamCategory) => ({
        team_category_id: teamCategory,
        fee: eventData.registrationFee,
      })),
    };
  }

  const feesData = [];
  for (const fee of eventData.registrationFees) {
    if (fee.teamCategory === TEAM_CATEGORIES.TEAM_INDIVIDUAL) {
      feesData.push({ team_category_id: TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE, fee: fee.amount });
      feesData.push({ team_category_id: TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE, fee: fee.amount });
    } else {
      feesData.push({ team_category_id: fee.teamCategory, fee: fee.amount });
    }
  }

  return {
    event_id: eventData.event_id,
    data: feesData,
  };
}

function formatServerDatetime(date, time) {
  const dateString = format(date, "yyyy-MM-dd");
  const timeString = format(time, "HH:mm:ss");
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

export default PageEventDetailManage;
