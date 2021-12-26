import * as React from "react";
import { stringUtil } from "utils";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs } from "constants/index";
import { eventDataReducer } from "../hooks/create-event-data";

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
    description: "Banner dan Informasi mengenai event Anda",
  },
  {
    step: 2,
    label: "Kategori Lomba",
    description: "Banner dan Informasi mengenai event Anda",
  },
  {
    step: 3,
    label: "Biaya Registrasi",
    description: "Banner dan Informasi mengenai event Anda",
  },
];

const { EVENT_TYPES } = eventConfigs;

const initialEventCategoryKey = stringUtil.createRandom();
const initialEventData = {
  eventType: EVENT_TYPES.FULLDAY,
  eventName: "Event Memanah Bergengsi 2099",
  description: "Meningkatkan tumbuh kembang anak.",
  location: "The HuB Cibubububur",
  locationType: "Both",
  city: "Semarang",
  extraInfos: [],
  eventCategories: [
    {
      key: initialEventCategoryKey,
      competitionCategory: { label: "Barebow", value: "Barebow" },
      categoryDetails: [
        {
          key: stringUtil.createRandom(),
          categoryKey: initialEventCategoryKey,
          competitionCategory: "",
          ageCategory: "",
          teamCategory: "",
          distance: "",
          quota: "",
        },
      ],
    },
  ],
  isFlatRegistrationFee: true,
  registrationFee: "",
  registrationFees: [],
};

const EventsNewFullday = () => {
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);
  const [eventData, updateEventData] = React.useReducer(eventDataReducer, initialEventData);
  const [shouldShowPreview, setShouldShowPreview] = React.useState(false);

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
                  <p>Banner dan Informasi mengenai event Anda</p>
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
                        Preview
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
        eventData={eventData}
        onClose={() => setShouldShowPreview(false)}
      />
    </React.Fragment>
  );
};

export default EventsNewFullday;
