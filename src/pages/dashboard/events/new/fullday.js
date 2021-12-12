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
import { Step1, Step2, Step3 } from "../components/new-fullday";

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

const EventsNewFullday = () => {
  const { steps, stepsTotal, currentStep, currentLabel, goToStep, goToPreviousStep, goToNextStep } =
    useWizardView(stepsData);

  return (
    <div className="page-content">
      <MetaTags>
        <title>Registrasi Event Baru | MyArchery.id</title>
      </MetaTags>

      <div style={{ height: 60, marginBottom: 40, backgroundColor: "#ffffff" }}>
        <Container fluid className="d-flex">
          <div className="d-flex mx-auto">
            <ul className="d-flex mb-0" style={{ listStyle: "none", padding: 0 }}>
              <li style={{ padding: 8, marginRight: 8 }}>
                <strong>+ Jenis Waktu</strong> Full Day
              </li>
              <li style={{ padding: 8, marginRight: 8 }}>
                <strong>+ Jenis Pertandingan</strong> Turnamen
              </li>
              <li style={{ padding: 8 }}>
                <strong>+ DKI Jakarta Series</strong>
              </li>
            </ul>
            <ButtonBlue>Ubah</ButtonBlue>
          </div>
        </Container>
      </div>

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
                    <Step1 />
                  </WizardViewContent>

                  <WizardViewContent>
                    <Step2 />
                  </WizardViewContent>

                  <WizardViewContent>
                    <Step3 />
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
  );
};

export default EventsNewFullday;
