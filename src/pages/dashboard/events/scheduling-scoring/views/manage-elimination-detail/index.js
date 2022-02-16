import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import Switch from "react-switch";
import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { BreadcrumbDashboard } from "../../../components/breadcrumb";
import { FieldInputDateSmall, FieldInputTextSmall, FieldSelectBudRest } from "../../components/";

import { StyledPageWrapper } from "./styles";

function PageConfigEliminationDetail() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Atur Jadwal dan Skor Pertandingan | MyArchery.id</title>
      </MetaTags>

      <StyledPageWrapper>
        <Container fluid>
          <BreadcrumbDashboard to={`/dashboard/event/${eventId}/scheduling-scoring`}>
            Kembali
          </BreadcrumbDashboard>

          <ContentSection>
            <div>
              <StackedFieldDisplay>
                <div>Kategori</div>
                <h5>Traditional Bow</h5>
              </StackedFieldDisplay>
            </div>

            <PanelCard>
              <TopConfigBar>
                <SpacedBoxesLined>
                  <StackedFieldDisplay>
                    <div>Jenis Regu</div>
                    <h5>Individu</h5>
                  </StackedFieldDisplay>

                  <StackedFieldDisplay>
                    <div>Kelas</div>
                    <h5>Umum</h5>
                  </StackedFieldDisplay>

                  <StackedFieldDisplay>
                    <div>Jarak</div>
                    <h5>50m</h5>
                  </StackedFieldDisplay>
                </SpacedBoxesLined>

                <SpacedBoxesLined>
                  <FieldInputDateSmall>Tanggal</FieldInputDateSmall>
                  <FieldSelectBudRest placeholder="Pilih jumlah babak" value={null}>
                    Jumlah Babak
                  </FieldSelectBudRest>
                </SpacedBoxesLined>

                <SpacedButtonsGroupRight>
                  <ButtonOutlineBlue>Terapkan</ButtonOutlineBlue>
                </SpacedButtonsGroupRight>
              </TopConfigBar>
            </PanelCard>

            <PanelCard>
              <SplitPanelContent>
                <MatchBracketContainer>Match bracket</MatchBracketContainer>

                <div>
                  <BracketConfigPanel>
                    <SpacedBoxesStacked>
                      <div>
                        <h6>Bantalan</h6>

                        <SpacedBoxesLined>
                          <FieldInputTextSmall>Mulai</FieldInputTextSmall>
                          <FieldInputTextSmall>Akhir</FieldInputTextSmall>
                          <FieldSelectBudRest placeholder="Target face">
                            Target Face
                          </FieldSelectBudRest>
                        </SpacedBoxesLined>
                      </div>

                      <div>
                        <h6>Sesi</h6>

                        <SpacedBoxesStacked>
                          <FieldToggleVariant>Jam beda tiap sesi</FieldToggleVariant>

                          <FieldInputDateSmall placeholder="Atur jam" value={null}>
                            Sesi
                          </FieldInputDateSmall>
                        </SpacedBoxesStacked>
                      </div>
                    </SpacedBoxesStacked>

                    <div>
                      <ButtonBlueBlock>Simpan</ButtonBlueBlock>
                    </div>
                  </BracketConfigPanel>
                </div>
              </SplitPanelContent>
            </PanelCard>
          </ContentSection>
        </Container>
      </StyledPageWrapper>
    </React.Fragment>
  );
}

const ContentSection = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const PanelCard = styled.div`
  padding: 1rem 1.25rem;
  background-color: #ffffff;
`;

const StackedFieldDisplay = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }

  > *:last-child {
    font-weight: 600;
  }
`;

const TopConfigBar = styled.div`
  display: flex;
  gap: 1.5rem 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1 0 20rem;
  }
`;

const SpacedBoxesLined = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1 0 0%;
  }
`;

const SpacedBoxesStacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1 0 0%;
  }
`;

const SpacedButtonsGroupRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
`;

const SplitPanelContent = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  > *:first-child {
    flex: 10 0 20rem;
  }

  > *:last-child {
    flex: 1 0 20rem;
  }
`;

const MatchBracketContainer = styled.div`
  overflow: auto;
  height: 400px;
`;

const BracketConfigPanel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  > * > * > *:first-child {
    font-weight: 600;
  }
`;

const StyledFieldToggleVariant = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  text-align: right;
`;

function FieldToggleVariant({ children }) {
  return (
    <StyledFieldToggleVariant>
      <span>{children}</span>
      <Switch
        checked={false}
        onChange={() => {}}
        offColor="#eeeeee"
        onColor="#B4C6E2"
        onHandleColor="#0d47a1"
        height={16}
        width={36}
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      />
    </StyledFieldToggleVariant>
  );
}

const ButtonBlueBlock = styled(ButtonBlue)`
  width: 100%;
`;

export default PageConfigEliminationDetail;
