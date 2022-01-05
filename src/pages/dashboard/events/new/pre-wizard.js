import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventConfigs } from "constants/index";

import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import { WizardView, WizardViewContent, ProgressBarLine } from "components/ma";
import Step1 from "../components/pre-wizard/Step1";
import Step2 from "../components/pre-wizard/Step2";

const stepsList = [
  { step: 1, label: "Tentukan jenis waktu pelaksanaan" },
  { step: 2, label: "Tentukan jenis pertandingan" },
  { step: 3, label: "Daftar sebagai Event DKI Jakarta Series" },
];

const { EVENT_TYPES, MATCH_TYPES } = eventConfigs;

export default function PreWizard() {
  const { currentStep, stepsTotal, goToNextStep, goToPreviousStep } = useWizardView(stepsList);
  const computeProgressValue = () => currentStep / stepsTotal;

  const [eventType, setEventType] = React.useState(EVENT_TYPES.FULLDAY);
  const [matchType, setMatchType] = React.useState(MATCH_TYPES.TOURNAMENT);

  const handleEventTypeChange = (ev) => setEventType(ev.target.value);
  const handleMatchTypeChange = (ev) => setMatchType(ev.target.value);

  const shouldButtonNextDisabled = () => {
    if (currentStep === 1 && !eventType) {
      return true;
    }
    if (currentStep === 2 && !matchType) {
      return true;
    }
    return false;
  };

  return (
    <div className="page-content">
      <MetaTags>
        <title>... persiapan registrasi event baru | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        <Row>
          <Col>
            <div
              className="d-flex justify-content-center align-items-center h-100"
              style={{ color: "var(--bs-gray-500)" }}
            >
              <span style={{ border: "solid 1px var(--bs-gray-400)", padding: 10 }}>
                TBD: gambar ilustrasi
              </span>
            </div>
          </Col>

          <Col>
            <div className="px-5">
              <div className="mb-4">
                <ProgressBarLine value={computeProgressValue()} />
              </div>

              <WizardView currentStep={currentStep}>
                <WizardViewContent>
                  <Step1 eventType={eventType} onChange={handleEventTypeChange} />
                </WizardViewContent>

                <WizardViewContent>
                  <Step2 matchType={matchType} onChange={handleMatchTypeChange} />
                </WizardViewContent>
              </WizardView>

              <ActionButtonGroup className="mt-5">
                {currentStep === 2 ? (
                  <a className="button-action next" href="/dashboard/events/new/fullday">
                    Buat Event
                  </a>
                ) : (
                  <button
                    className="button-action next"
                    disabled={shouldButtonNextDisabled()}
                    onClick={() => goToNextStep()}
                  >
                    Lanjut
                  </button>
                )}

                {currentStep === 1 ? (
                  <a className="button-action back" href="/dashboard">
                    Kembali
                  </a>
                ) : (
                  <button className="button-action back" onClick={() => goToPreviousStep()}>
                    Kembali
                  </button>
                )}
              </ActionButtonGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const ActionButtonGroup = styled.div`
  .button-action {
    display: block;
    width: 100%;
    padding: 16px 20px;
    border-radius: 4px;
    border: none;
    font-weight: 600;
    text-align: center;
    transition: background-color 0.2s;

    &.next {
      background-color: var(--ma-blue);
      color: #ffffff;
    }

    &:disabled {
      background-color: var(--ma-gray-400);
    }

    &.back {
      margin-top: 10px;
      background-color: unset;
      color: var(--ma-blue);
    }
  }
`;
