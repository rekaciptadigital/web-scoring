import * as React from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
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

const EventsNewFullday = () => {
  const history = useHistory();
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);
  const [eventData, updateEventData] = React.useReducer(eventDataReducer, initialEventData);
  const { validate: validateForm, errors: validationErrors } = useEventDataValidation(eventData);

  const [savingEventStatus, setSavingEventStatus] = React.useState({ status: "idle", error: null });
  const [shouldShowPreview, setShouldShowPreview] = React.useState(false);

  const isLoading = savingEventStatus.status === "loading";

  const handleValidateBeforePreview = () => {
    const onValid = () => setShouldShowPreview(true);

    const onInvalid = (errors) => {
      const lowToHigh = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
      const invalidSteps = Object.keys(errors)
        .map((step) => parseInt(step))
        .sort(lowToHigh);
      goToStep(invalidSteps[0]);
    };

    validateForm({ onValid, onInvalid });
  };

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
                  <h2>{currentLabel}</h2>
                  <p>{steps[currentStep - 1].description}</p>
                </Col>
              </Row>

              <div className="content-scrollable flex-grow-1 mb-5">
                <div className="content-scrollable-inner">
                  <WizardView currentStep={currentStep}>
                    <WizardViewContent>
                      <StepInfoUmum
                        eventData={eventData}
                        updateEventData={updateEventData}
                        validationErrors={validationErrors[1] || {}}
                      />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepKategori
                        eventData={eventData}
                        updateEventData={updateEventData}
                        validationErrors={validationErrors[2] || {}}
                      />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepBiaya
                        eventData={eventData}
                        updateEventData={updateEventData}
                        validationErrors={validationErrors[3] || {}}
                      />
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
                        onClick={handleValidateBeforePreview}
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

function formatServerDatetime(date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
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
      eventStart_register: formatServerDatetime(eventData.registrationDateStart),
      eventEnd_register: formatServerDatetime(eventData.registrationDateEnd),
      eventStart: formatServerDatetime(eventData.eventDateStart),
      eventEnd: formatServerDatetime(eventData.eventDateEnd),
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
          team_category_id: detail.teamCategory?.value,
        };
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
      category.team_category_id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
      category.team_category_id === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE
        ? TEAM_CATEGORIES.TEAM_INDIVIDUAL
        : category.team_category_id;

    const feeItem = eventData.registrationFees.find(
      (fee) => fee.teamCategory === targetTeamCategory
    );
    return { ...category, fee: feeItem?.amount || 0 };
  });

  return categoriesWithTeamFees;
}

function useEventDataValidation(eventData) {
  const [validation, setValidation] = React.useState({ errors: {} });
  const { errors: validationErrors } = validation;
  const isValid = !Object.keys(validationErrors)?.length;

  const ValidationErrors = ValidationErrorsByStep(validationErrors);

  const validate = ({ onValid, onInvalid }) => {
    const Step1 = StepGroupValidation();
    const Step2 = StepGroupValidation();
    const Step3 = StepGroupValidation();

    // STEP 1: Informasi Umum
    Step1.validate("bannerImage", () => {
      if (!eventData.bannerImage?.raw) {
        return "required";
      }
    });

    Step1.validate("eventName", () => {
      if (!eventData.eventName) {
        return "required";
      }
    });

    Step1.validate("location", () => {
      if (!eventData.location) {
        return "required";
      }
    });

    Step1.validate("locationType", () => {
      if (!eventData.locationType) {
        return "required";
      }
    });

    Step1.validate("city", () => {
      if (!eventData.city?.value) {
        return "required";
      }
    });

    Step1.validate("registrationDateStart", () => {
      if (!eventData.registrationDateStart) {
        return "required";
      }
    });

    Step1.validate("registrationDateEnd", () => {
      if (!eventData.registrationDateEnd) {
        return "required";
      }
    });

    Step1.validate("registrationTimeStart", () => {
      if (!eventData.registrationTimeStart) {
        return "required";
      }
    });

    Step1.validate("registrationTimeEnd", () => {
      if (!eventData.registrationTimeEnd) {
        return "required";
      }
    });

    Step1.validate("eventDateStart", () => {
      if (!eventData.eventDateStart) {
        return "required";
      }
    });

    Step1.validate("eventDateEnd", () => {
      if (!eventData.eventDateEnd) {
        return "required";
      }
    });

    Step1.validate("eventTimeStart", () => {
      if (!eventData.eventTimeStart) {
        return "required";
      }
    });

    Step1.validate("eventTimeEnd", () => {
      if (!eventData.eventTimeEnd) {
        return "required";
      }
    });

    // STEP 2: Kategori
    for (const categoryGroup of eventData.eventCategories) {
      Step2.validate(`${categoryGroup.key}-competitionCategory`, () => {
        if (!categoryGroup.competitionCategory?.value) {
          return "required";
        }
      });

      for (const detail of categoryGroup.categoryDetails) {
        Step2.validate(`${categoryGroup.key}-${detail.key}-ageCategory`, () => {
          if (!detail.ageCategory?.value) {
            return "required";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-distance`, () => {
          if (!detail.distance?.length) {
            return "required";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-teamCategory`, () => {
          if (!detail.teamCategory?.value) {
            return "required";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-quota`, () => {
          if (!detail.quota) {
            return "required";
          }
        });
      }
    }

    // STEP 3: Biaya Registrasi
    if (eventData.isFlatRegistrationFee) {
      Step3.validate("registrationFee", () => {
        if (!eventData.registrationFee) {
          return "required";
        }
      });
    } else {
      // Hanya validasikan harga tim yang dipilih di kategori.
      // Jenis tim yang tidak dipilih di kategori tidak diwajibkan diisi,
      // sehingga tidak dihitung error.
      const selectedTeamCategories = [];
      for (const categoryGroup of eventData.eventCategories) {
        for (const detail of categoryGroup.categoryDetails) {
          if (!detail.teamCategory?.value) {
            continue;
          }

          if (
            detail.teamCategory.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
            detail.teamCategory.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE
          ) {
            selectedTeamCategories.push(TEAM_CATEGORIES.TEAM_INDIVIDUAL);
          } else {
            selectedTeamCategories.push(detail.teamCategory?.value);
          }
        }
      }

      for (const fee of eventData.registrationFees) {
        const isTeamCategorySelected = selectedTeamCategories.some(
          (team) => team === fee.teamCategory
        );

        if (!isTeamCategorySelected) {
          continue;
        }

        Step3.validate(`registrationFee-${fee.teamCategory}`, () => {
          if (!fee.amount) {
            return "required";
          }
        });
      }
    }

    ValidationErrors.addByGroup({ stepGroup: 1, errors: Step1.errors });
    ValidationErrors.addByGroup({ stepGroup: 2, errors: Step2.errors });
    ValidationErrors.addByGroup({ stepGroup: 3, errors: Step3.errors });

    setValidation((state) => ({ ...state, errors: ValidationErrors.nextErrorsState }));

    if (ValidationErrors.isNextValid()) {
      onValid?.();
    } else {
      onInvalid?.(ValidationErrors.nextErrorsState);
    }
  };

  return { isValid, errors: validationErrors, validate };
}

const ValidationErrorsByStep = (errorsState) => {
  const nextErrorsState = { ...errorsState };
  const isNextValid = () => !Object.keys(nextErrorsState)?.length;

  const addByGroup = ({ stepGroup, errors }) => {
    if (!Object.keys(errors)?.length) {
      delete nextErrorsState[stepGroup];
    } else {
      nextErrorsState[stepGroup] = errors;
    }
  };

  return { nextErrorsState, isNextValid, addByGroup };
};

const StepGroupValidation = () => {
  const validationErrors = {};
  return {
    errors: validationErrors,
    validate: (fieldName, validate) => {
      const result = validate();
      if (result) {
        validationErrors[fieldName] = [result];
      }
    },
  };
};

export default EventsNewFullday;
