import * as React from "react";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs } from "constants/index";

import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import {
  Button,
  ButtonBlue,
  ButtonRed,
  StepList,
  WizardView,
  WizardViewContent,
} from "components/ma";
import { Step1, Step2, Step3, RibbonEventConfig } from "../components/new-fullday";

const stepsData = [
  {
    step: 1,
    label: "Informasi Umum",
    description: "Banner dan Informasi mengenai event Anda",
  },
  {
    step: 2,
    label: "Biaya Registrasi",
    description: "Banner dan Informasi mengenai event Anda",
  },
  {
    step: 3,
    label: "Kategori Lomba",
    description: "Banner dan Informasi mengenai event Anda",
  },
];

const { EVENT_TYPES } = eventConfigs;

const initialEventData = {
  eventType: EVENT_TYPES.FULLDAY,
};

const EventsNewFullday = () => {
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);

  const [eventData, setEventData] = React.useState(initialEventData);

  const handleStepChange = (ev) => {
    setEventData(ev?.target?.value || { ...initialEventData });
  };

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

                <Col lg="auto">
                  <Button className="me-2 px-4">Simpan</Button>
                  <ButtonBlue className="me-2 px-4">Preview</ButtonBlue>
                  <ButtonRed className="px-4">Publish</ButtonRed>
                </Col>
              </Row>

              <div className="content-scrollable flex-grow-1">
                <div className="content-scrollable-inner">
                  <WizardView currentStep={currentStep}>
                    <WizardViewContent>
                      <Step1 eventData={eventData} onChange={handleStepChange} />
                    </WizardViewContent>

                    <WizardViewContent>
                      <Step2 eventData={eventData} onChange={handleStepChange} />
                    </WizardViewContent>

                    <WizardViewContent>
                      <Step3 eventData={eventData} onChange={handleStepChange} />
                    </WizardViewContent>
                  </WizardView>

                  <div
                    className="mx-auto d-flex justify-content-around align-items-center flex-wrap"
                    style={{ color: "#0D47A1", maxWidth: "300px" }}
                  >
                    {currentStep > 1 && (
                      <a onClick={() => goToPreviousStep()}>
                        <i className="mdi mdi-chevron-up" />
                        <span className="ms-1">Previous</span>
                      </a>
                    )}

                    {currentStep < stepsTotal && (
                      <a onClick={() => goToNextStep()}>
                        <i className="mdi mdi-chevron-down" />
                        <span className="ms-1">Next</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNewFullday;
