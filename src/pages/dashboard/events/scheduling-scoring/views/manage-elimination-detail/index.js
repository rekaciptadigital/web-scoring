import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";
import { BreadcrumbDashboard } from "../../../components/breadcrumb";
import { FieldSelectParticipantCounts } from "./field-select-participant-counts";

import { StyledPageWrapper } from "./styles";

function PageConfigEliminationDetail() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const location = useLocation();
  const { category } = location.state;

  return (
    <React.Fragment>
      <MetaTags>
        <title>Atur Jadwal dan Skor Pertandingan | MyArchery.id</title>
      </MetaTags>

      <StyledPageWrapper>
        <Container fluid>
          <BreadcrumbDashboard
            to={location.state.from || `/dashboard/event/${eventId}/scheduling-scoring`}
          >
            Kembali
          </BreadcrumbDashboard>

          <ContentSection>
            <div>
              <StackedFieldDisplay>
                <div>Kategori</div>
                <h5>{category.competitionCategoryId}</h5>
              </StackedFieldDisplay>
            </div>

            <PanelCard>
              <TopConfigBar>
                <SpacedBoxesLined>
                  <StackedFieldDisplay>
                    <div>Jenis Regu</div>
                    <h5>{category.teamCategoryDetail.label}</h5>
                  </StackedFieldDisplay>

                  <StackedFieldDisplay>
                    <div>Kelas</div>
                    <h5>{category.ageCategoryId}</h5>
                  </StackedFieldDisplay>

                  <StackedFieldDisplay>
                    <div>Jarak</div>
                    <h5>{category.distanceId}m</h5>
                  </StackedFieldDisplay>
                </SpacedBoxesLined>

                <SpacedBoxesLined>
                  <FieldSelectParticipantCounts placeholder="Pilih jumlah peserta" value={null}>
                    Jumlah Peserta Eliminasi
                  </FieldSelectParticipantCounts>
                </SpacedBoxesLined>

                <SpacedButtonsGroupRight>
                  <ButtonOutlineBlue>Terapkan</ButtonOutlineBlue>
                </SpacedButtonsGroupRight>
              </TopConfigBar>
            </PanelCard>

            <PanelCard>
              <SplitPanelContent>
                <MatchBracketContainer>Match bracket</MatchBracketContainer>
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
    text-transform: capitalize;
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

export default PageConfigEliminationDetail;
