import * as React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { stringUtil } from "utils";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs, eventCategories } from "constants/index";
import { eventDataReducer } from "../../hooks/create-event-data";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { Toaster } from "react-hot-toast";
import {
  StepList,
  WizardView,
  WizardViewContent,
  ButtonBlue,
  ButtonOutlineBlue,
} from "components/ma";
import {
  StepInfoUmum,
  StepBiaya,
  StepKategori,
  StepJadwal,
  StepSelesai,
  RibbonEventConfig,
} from "../../components/new-fullday";
import { PreviewPortal } from "../../components/preview";
import { LoadingScreen } from "../components/loading-screen-portal";

import IconAlertTriangle from "components/ma/icons/mono/alert-triangle";

import "pages/dashboard/events/style-overrides/main-content.scss";

const stepsData = [
  {
    step: 1,
    label: "Informasi Umum",
    description: "Banner dan informasi mengenai event Anda",
  },
  {
    step: 2,
    label: "Biaya Registrasi",
    description: "Pengaturan biaya pendaftaran pertandingan",
  },
  {
    step: 3,
    label: "Kategori Lomba",
    description: "Pengaturan kategori beserta detailnya",
  },
  {
    step: 4,
    label: "Jadwal Pertandingan",
    description: "Atur jadwal pertandingan event Anda",
  },
  {
    step: 5,
    label: "Selesai",
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
  handbook: null,
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
  earlyBirdRegistrationFee: "",
  earlyBirdRegistrationFees: [
    { key: 1, teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL, amount: "" },
    { key: 2, teamCategory: TEAM_CATEGORIES.TEAM_MALE, amount: "" },
    { key: 3, teamCategory: TEAM_CATEGORIES.TEAM_FEMALE, amount: "" },
    { key: 4, teamCategory: TEAM_CATEGORIES.TEAM_MIXED, amount: "" },
  ],
  dateEarlyBird: null,
};

const EventsNewFullday = () => {
  const history = useHistory();
  const { steps, currentStep, stepsTotal, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);

  const [lastActiveStep, setLastActiveStep] = React.useState(1);

  const increaseLastActiveStep = () => {
    const nextStepNumber = currentStep + 1;
    if (lastActiveStep > nextStepNumber) {
      return;
    }
    setLastActiveStep(nextStepNumber);
  };

  const [eventData, updateEventData] = React.useReducer(eventDataReducer, initialEventData);
  const { errors: validationErrors } = useEventDataValidation(eventData);

  const { sendFakeSubmit, isLoading: isLoadingSubmit } = useFakeServerSubmit();

  const [savingEventStatus, setSavingEventStatus] = React.useState({
    status: "idle",
    errors: null,
  });
  const [shouldShowPreview, setShouldShowPreview] = React.useState(false);

  const isLoading = savingEventStatus.status === "loading";
  const isErrorSubmiting = savingEventStatus.status === "error";

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
      setSavingEventStatus((state) => ({ ...state, status: "error", errors: result.errors }));
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
      setSavingEventStatus((state) => ({ ...state, status: "error", errors: result.errors }));
    }
  };

  const handleClickSaveButton = () => {
    // 1. invalid
    // 2. hit endpoint sukses
    sendFakeSubmit({
      onSuccess() {
        toast.success("Event telah disimpan");
        increaseLastActiveStep();
        goToNextStep();
      },
    });
    // 3. hit endpoint gagal/error
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <React.Fragment>
      <Toaster
        containerStyle={{ top: 80 }}
        toastOptions={{
          success: {
            style: {
              background: "var(--ma-primary-blue-50)",
            },
          },
        }}
      />

      {/* TODO: improve conditional rendering-nya jadi hanya ketika formnya belum disimpan */}
      {lastActiveStep === 1 && (
        <div>
          <RibbonEventConfig />
        </div>
      )}

      <StyledPageWrapper>
        <MetaTags>
          <title>Buat Event Baru | MyArchery.id</title>
        </MetaTags>

        <Container fluid>
          <StickyContainer>
            <StickyItem>
              <StepList
                steps={steps}
                currentStep={currentStep}
                lastActiveStep={lastActiveStep}
                onChange={(ev) => goToStep(ev.target.value)}
              >
                Pertandingan
              </StepList>
            </StickyItem>

            <StickyItemSibling>
              <RowStickyHeader>
                {currentStep < stepsTotal && (
                  <Col>
                    <h2>{currentLabel}</h2>
                    <p>{steps[currentStep - 1].description}</p>
                  </Col>
                )}
              </RowStickyHeader>

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
                      <StepBiaya
                        eventData={eventData}
                        updateEventData={updateEventData}
                        validationErrors={validationErrors[3] || {}}
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
                      <StepJadwal
                        eventData={eventData}
                        updateEventData={updateEventData}
                        validationErrors={validationErrors[4] || {}}
                      />
                    </WizardViewContent>

                    <WizardViewContent>
                      <StepSelesai eventData={eventData} />
                    </WizardViewContent>
                  </WizardView>

                  {currentStep < stepsTotal && (
                    <div className="mx-auto d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        {currentStep > 1 && (
                          <ButtonOutlineBlue corner="8" onClick={() => goToPreviousStep()}>
                            Sebelumnya
                          </ButtonOutlineBlue>
                        )}
                      </div>

                      <div>
                        <ButtonBlue corner="8" onClick={handleClickSaveButton}>
                          Simpan
                        </ButtonBlue>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </StickyItemSibling>
          </StickyContainer>
        </Container>
      </StyledPageWrapper>

      <PreviewPortal
        isActive={shouldShowPreview}
        isLoading={isLoading}
        eventData={eventData}
        onClose={() => setShouldShowPreview(false)}
        onSave={handleSaveEvent}
        onPublish={handlePublishEvent}
      />

      <LoadingScreen loading={isLoadingSubmit} />

      <AlertSubmitError isError={isErrorSubmiting} errors={savingEventStatus.errors} />
    </React.Fragment>
  );
};

const StyledPageWrapper = styled.div`
  margin: 2.5rem 0;
`;

const StickyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem;
`;

const StickyItem = styled.div`
  position: sticky;
  z-index: 100;
  @media (max-width: 782px) {
    position: static;
  }

  top: calc(70px + 2.5rem);
  flex: 1 1 15rem;
`;

const StickyItemSibling = styled.div`
  flex: 12 1 30rem;
`;

const RowStickyHeader = styled(Row)`
  position: sticky;
  top: 2.5rem;
  z-index: 80;
  background-color: var(--bs-body-bg);
  padding-top: var(--ma-header-height);
  margin-top: calc(-1 * var(--ma-header-height));
`;

function AlertSubmitError({ isError, errors, onConfirm }) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const renderErrorMessages = () => {
    if (errors && typeof errors === "string") {
      return errors;
    }

    if (errors) {
      const fields = Object.keys(errors);
      const messages = fields.map(
        (field) => `${errors[field].map((message) => `- ${message}\n`).join("")}`
      );
      if (messages.length) {
        return `${messages.join("")}`;
      }
    }

    return "Error tidak diketahui.";
  };

  const handleConfirm = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  React.useEffect(() => {
    if (!isError) {
      return;
    }
    setAlertOpen(true);
  }, [isError]);

  return (
    <React.Fragment>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        style={{ padding: "30px 40px", width: "720px" }}
        onConfirm={handleConfirm}
        customButtons={
          <span className="d-flex flex-column w-100">
            <ButtonBlue onClick={handleConfirm}>Tutup</ButtonBlue>
          </span>
        }
      >
        <h4>
          <IconAlertTriangle />
        </h4>
        <div className="text-start">
          <p>
            Terdapat kendala teknis dalam memproses data. Coba kembali beberapa saat lagi, atau
            silakan berikan pesan error berikut kepada technical support:
          </p>
          <pre className="p-3" style={{ backgroundColor: "var(--ma-gray-100)" }}>
            {renderErrorMessages()}
          </pre>
        </div>
      </SweetAlert>
    </React.Fragment>
  );
}

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
  const handbookBase64 = eventData.handbook ? await imageToBase64(eventData.handbook) : null;

  const generatedCategories = makeEventCategories(eventData.eventCategories);
  const categoriesWithFees = makeCategoryFees(eventData, generatedCategories);

  return {
    status: options.status || PUBLICATION_TYPES.DRAFT,
    eventType: eventData.eventType,
    eventCompetition: eventData.eventCompetition,
    publicInformation: {
      eventName: eventData.eventName,
      handbook: handbookBase64,
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
  let newDateEarly = new Date(eventData?.dateEarlyBird);
  let early_date_bird = `${newDateEarly.getFullYear()}-${
    newDateEarly.getMonth() + 1
  }-${newDateEarly.getDate()}`;
  if (eventData.isFlatRegistrationFee) {
    return categoriesData.map((category) => ({
      ...category,
      fee: eventData.registrationFee || 0,
      early_bird: eventData.earlyBirdRegistrationFee || 0,
      end_date_early_bird: early_date_bird || null,
    }));
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
    const earlyItem = eventData.earlyBirdRegistrationFees.find(
      (early_bird) => early_bird.teamCategory === targetTeamCategory
    );
    return {
      ...category,
      fee: feeItem?.amount || 0,
      end_date_early_bird: early_date_bird || null,
      early_bird: earlyItem?.amount,
    };
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

    // STEP 1: Informasi Umum
    Step1.validate("bannerImage", () => {
      if (!eventData.bannerImage?.raw) {
        return "Wajib diisi";
      }
    });

    Step1.validate("eventName", () => {
      if (!eventData.eventName) {
        return "Wajib diisi";
      }
    });

    Step1.validate("location", () => {
      if (!eventData.location) {
        return "Wajib diisi";
      }
    });

    Step1.validate("locationType", () => {
      if (!eventData.locationType) {
        return "Wajib diisi";
      }
    });

    Step1.validate("city", () => {
      if (!eventData.city?.value) {
        return "Wajib diisi";
      }
    });

    Step1.validate("registrationDateStart", () => {
      if (!eventData.registrationDateStart) {
        return "Wajib diisi";
      }
    });

    Step1.validate("registrationDateEnd", () => {
      if (!eventData.registrationDateEnd) {
        return "Wajib diisi";
      }

      if (eventData.registrationDateEnd <= eventData.registrationDateStart) {
        return "Tanggal dan jam tutup pendaftaran harus setelah waktu mulai pendaftaran";
      }
    });

    Step1.validate("eventDateStart", () => {
      if (!eventData.eventDateStart) {
        return "Wajib diisi";
      }
    });

    Step1.validate("eventDateEnd", () => {
      if (!eventData.eventDateEnd) {
        return "Wajib diisi";
      }

      if (eventData.eventDateEnd <= eventData.eventDateStart) {
        return "Tanggal dan jam akhir lomba harus setelah waktu mulai lomba";
      }
    });

    // STEP 2: Kategori
    for (const categoryGroup of eventData.eventCategories) {
      Step2.validate(`${categoryGroup.key}-competitionCategory`, () => {
        if (!categoryGroup.competitionCategory?.value) {
          return "Wajib diisi";
        }
      });

      for (const detail of categoryGroup.categoryDetails) {
        Step2.validate(`${categoryGroup.key}-${detail.key}-ageCategory`, () => {
          if (!detail.ageCategory?.value) {
            return "Wajib diisi";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-distance`, () => {
          if (!detail.distance?.length) {
            return "Wajib diisi";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-teamCategory`, () => {
          if (!detail.teamCategory?.value) {
            return "Wajib diisi";
          }
        });

        Step2.validate(`${categoryGroup.key}-${detail.key}-quota`, () => {
          if (!detail.quota) {
            return "Wajib diisi";
          }
        });
      }
    }

    ValidationErrors.addByGroup({ stepGroup: 1, errors: Step1.errors });
    ValidationErrors.addByGroup({ stepGroup: 2, errors: Step2.errors });

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

function useFakeServerSubmit() {
  const [state, dispatch] = React.useReducer((state, action) => ({ ...state, ...action }), {
    status: "idle",
  });

  const sendFakeSubmit = ({ loadingTime = 500, onSuccess }) => {
    dispatch({ status: "loading" });
    setTimeout(() => {
      dispatch({ status: "success" });
      onSuccess?.();
    }, loadingTime);
  };

  const isLoading = state.status === "loading";
  const isSuccess = state.status === "success";

  return { sendFakeSubmit, isLoading, isSuccess };
}

export { EventsNewFullday };
