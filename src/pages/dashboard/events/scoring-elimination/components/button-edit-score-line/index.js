import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-detail";

import { Modal, ModalBody } from "reactstrap";

import {
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
  SpinnerDotBlock,
  AlertSubmitError,
} from "components/ma";
import { ScoreGridForm } from "./components/score-grid-form";
import { ScoreGridFormRight } from "./components/score-grid-form-right";

import IconEdit from "components/ma/icons/mono/edit";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";
import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";

function ButtonEditScoreLine({ disabled, scoring }) {
  const [isOpen, setOpen] = React.useState(false);

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonOutlineBlue flexible onClick={open} disabled={disabled}>
        <span>Edit</span>{" "}
        <span>
          <IconEdit size="16" />
        </span>
      </ButtonOutlineBlue>

      {isOpen && (
        <ModalEditor onClose={close} scoring={scoring} toggle={() => setOpen((open) => !open)} />
      )}
    </React.Fragment>
  );
}

function ModalEditor({ onClose, toggle, scoring }) {
  const { isError, errors, data } = useScoringDetail(scoring);

  const commonModalProps = {
    isOpen: true,
    centered: true,
    backdrop: "static",
  };

  if (!data) {
    return (
      <React.Fragment>
        <AlertSubmitError isError={isError} errors={errors} onConfirm={onClose} />
        <Modal {...commonModalProps} size="md" toggle={toggle}>
          <ModalBody>
            <SpinnerDotBlock />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Modal {...commonModalProps} size="lg" autoFocus onClosed={onClose}>
        <ModalBody>
          <BodyWrapper>
            <div>
              <h4>Scoresheet</h4>

              <ScoresheetHeader>
                <InputBudrestNumber>1A</InputBudrestNumber>

                <PlayerLabelContainerLeft>
                  <PlayerNameData>
                    <RankLabel>#1</RankLabel> <NameLabel>Nama</NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerLeft>

                <HeadToHeadScores>
                  <InlineScoreInput>
                    {false && (
                      <IndicatorIconWarning>
                        <IconAlertCircle />
                      </IndicatorIconWarning>
                    )}
                    <InputInlineScore type="text" />
                  </InlineScoreInput>

                  <HeadToHeadScoreLabels>
                    <ScoreCounter>skor</ScoreCounter>
                    <span>&ndash;</span>
                    <ScoreCounter>skor</ScoreCounter>
                  </HeadToHeadScoreLabels>

                  <InlineScoreInput>
                    <InputInlineScore type="text" />
                    {false && (
                      <IndicatorIconValid>
                        <IconCheckOkCircle />
                      </IndicatorIconValid>
                    )}
                  </InlineScoreInput>
                </HeadToHeadScores>

                <PlayerLabelContainerRight>
                  <PlayerNameData>
                    <RankLabel>#1</RankLabel> <NameLabel>Nama</NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerRight>
              </ScoresheetHeader>

              <CategoryLabel>
                <div>{"Individu Putra"}</div>
                <div>
                  <IconBow size="16" /> {`${"Barebow"} ${"Umum"}`}
                </div>
                <div>
                  <IconDistance size="16" /> {"50m"}
                </div>
              </CategoryLabel>
            </div>

            <SplitEditor>
              <div>
                <ScoreGridForm />
              </div>

              <div>
                <ScoreGridFormRight />
              </div>
            </SplitEditor>

            <HorizontalSpaced>
              <Button onClick={onClose}>Batal</Button>
              <ButtonBlue onClick={onClose}>Tentukan</ButtonBlue>
            </HorizontalSpaced>
          </BodyWrapper>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

/* ================================== */
// styles

const BodyWrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const ScoresheetHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  padding: 1rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.5rem;
`;

const InputBudrestNumber = styled.div`
  padding: 0.625rem 0.5rem;
  width: 3rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
`;

const PlayerLabelContainerLeft = styled.div`
  flex-grow: 1;
  margin-right: 3rem;
`;

const PlayerLabelContainerRight = styled.div`
  flex-grow: 1;
  margin-left: 3rem;
`;

const PlayerNameData = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RankLabel = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-primary-blue-50);
  white-space: nowrap;
  font-weight: 600;
  text-align: center;
`;

const NameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;
`;

const HeadToHeadScores = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const InlineScoreInput = styled.div`
  position: relative;
`;

const InputInlineScore = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-200);
  border-radius: 0.25rem;
  color: var(--ma-gray-500);
  font-size: 0.85em;
  text-align: center;
`;

const IndicatorIconWarning = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1.75rem;
  display: flex;
  align-items: center;
  color: var(--ma-secondary);
`;

const IndicatorIconValid = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1.75rem;
  display: flex;
  align-items: center;
  color: var(--ma-alert-positive);
`;

const HeadToHeadScoreLabels = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ScoreCounter = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-gray-200);
  white-space: nowrap;
  text-align: center;
`;

const SplitEditor = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem 4rem;
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CategoryLabel = styled.div`
  margin: 1.25rem 0;
  display: flex;
  gap: 1px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;

  > * {
    flex-grow: 1;
    padding: 0.5rem;
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);
    text-align: center;
    font-weight: 600;
    text-transform: capitalize;
  }
`;

export { ButtonEditScoreLine };
