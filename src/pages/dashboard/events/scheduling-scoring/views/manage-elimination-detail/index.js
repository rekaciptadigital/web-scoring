import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMatchTemplate } from "./hooks/match-template";
import { EliminationService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import {
  Bracket,
  Seed as RBSeed,
  SeedItem as RBSeedItem,
  SeedTeam as RBSeedTeam,
} from "react-brackets";
import { LoadingScreen } from "components";
import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { BreadcrumbDashboard } from "../../../components/breadcrumb";
import { FieldSelectOption } from "./field-select-option";

import IconCheck from "components/ma/icons/fill/check";

import { StyledPageWrapper } from "./styles";

import classnames from "classnames";

const amountOptions = [
  { value: 16, label: 16 },
  { value: 8, label: 8 },
];

const scoringTypeOptions = [
  { value: 1, label: "Sistem Poin" },
  { value: 2, label: "Sistem Akumulasi Skor" },
];

const defaultEmptyOption = { label: "-" };

function PageConfigEliminationDetail() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const location = useLocation();
  const { category } = location.state;

  const [eliminationMemberCount, setEliminationMemberCount] = React.useState(null);
  const [scoringType, setScoringType] = React.useState(null);
  const [formStatus, dispatchFormStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  const { data: matchTemplate, refetch: refetchMatchTemplate } = useMatchTemplate({
    event_category_id: category.id,
  });

  const handleApplySettings = async () => {
    // TODO: alert confirm sebelum submit?
    dispatchFormStatus({ status: "loading", errors: null });

    const payload = {
      match_type: 1, // hard code
      event_category_id: category.id,
      elimination_member_count: eliminationMemberCount?.value || undefined,
      scoring_type: scoringType?.value || undefined,
    };

    const result = await EliminationService.setEventElimination(payload);
    if (result.success) {
      dispatchFormStatus({ status: "success" });
      refetchMatchTemplate();
    } else {
      dispatchFormStatus({ status: "error", errors: result.errors });
      // TODO: alert handle error submit?
    }
  };

  const isLoadingApply = formStatus.status === "loading";

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
                  <FieldSelectOption
                    placeholder="Pilih jumlah peserta"
                    disabled={!matchTemplate?.updated}
                    value={
                      eliminationMemberCount || (!matchTemplate?.updated && defaultEmptyOption)
                    }
                    options={amountOptions}
                    onChange={(option) => setEliminationMemberCount(option)}
                  >
                    Jumlah Peserta Eliminasi
                  </FieldSelectOption>

                  <FieldSelectOption
                    placeholder="Pilih jenis sistem scoring"
                    disabled={!matchTemplate?.updated}
                    value={scoringType || (!matchTemplate?.updated && defaultEmptyOption)}
                    options={scoringTypeOptions}
                    onChange={(option) => setScoringType(option)}
                  >
                    Jenis Scoring
                  </FieldSelectOption>
                </SpacedBoxesLined>

                <SpacedButtonsGroupRight>
                  {!matchTemplate?.updated && (
                    <div>
                      <IconCheck />
                    </div>
                  )}
                  <ButtonOutlineBlue
                    disabled={!matchTemplate?.updated}
                    onClick={handleApplySettings}
                  >
                    Terapkan
                  </ButtonOutlineBlue>
                </SpacedButtonsGroupRight>
              </TopConfigBar>
            </PanelCard>

            <BracketPanelCard>
              <SplitPanelContent>
                <MatchBracketContainer>
                  {matchTemplate && !matchTemplate.updated ? (
                    <OverflowingBracketContent>
                      <Bracket
                        rounds={matchTemplate.rounds || []}
                        renderSeedComponent={(bracketProps) => (
                          <SeedBagan
                            bracketProps={bracketProps}
                            configs={{
                              isSettingsApplied: !matchTemplate.updated,
                              totalRounds: matchTemplate.rounds.length - 1,
                            }}
                          />
                        )}
                      />
                    </OverflowingBracketContent>
                  ) : (
                    <SettingsNotApplied>
                      <h4>Terapkan pengaturan eliminasi di atas untuk membuat bagan</h4>
                    </SettingsNotApplied>
                  )}
                </MatchBracketContainer>
              </SplitPanelContent>
            </BracketPanelCard>
          </ContentSection>
        </Container>

        <LoadingScreen loading={isLoadingApply} />
      </StyledPageWrapper>
    </React.Fragment>
  );
}

function SeedBagan({ bracketProps, configs }) {
  const { seed, breakpoint } = bracketProps;

  const shouldEnableScoring = () => {
    const noWinnersYet = seed.teams.every((team) => team.win === 0);
    return configs.isSettingsApplied && noWinnersYet;
  };

  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem>
        <ItemContainer>
          {seed.teams.map((team, index) => (
            <SeedTeam key={index} className={classnames({ "item-past": false })}>
              <BoxName>{team.name || "-"}</BoxName>
              {typeof team.result === "number" && <BoxScore>{team.result}</BoxScore>}
            </SeedTeam>
          ))}

          {shouldEnableScoring() && (
            <FloatingControl>
              <ButtonScoring>scoring</ButtonScoring>
            </FloatingControl>
          )}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

const ButtonScoring = styled(ButtonBlue)`
  &,
  &:focus,
  &:active {
    padding: 2px 8px;
    font-size: 0.875em;
  }
`;

const Seed = styled(RBSeed)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const SeedItem = styled(RBSeedItem)`
  padding-left: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--ma-primary-blue-50);
`;

const SeedTeam = styled(RBSeedTeam)`
  gap: 0.25rem;
  padding: 0.5rem;
  border: solid 1px #0d47a1;
  border-radius: 0.25rem;
  background-color: #ffffff;
  color: var(--bs-body-color);
  font-size: var(--bs-body-font-size);

  &.item-past {
    border-color: #757575;
  }
`;

const ItemContainer = styled.div`
  position: relative;

  > ${SeedTeam} + ${SeedTeam} {
    border-top: none;
  }
`;

const BoxName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BoxScore = styled.span`
  display: inline-block;
  padding: 2px 0.375rem;
  border-radius: 0.25rem;
  background-color: var(--ma-gray-400);
  color: #ffffff;
  font-weight: 600;
`;

const FloatingControl = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(85%);
`;

const SettingsNotApplied = styled.div`
  height: 400px;
  padding: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  > * {
    color: var(--ma-gray-400);
  }
`;

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

const BracketPanelCard = styled.div`
  background-color: #ffffff;
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
  min-height: 400px;
`;

const OverflowingBracketContent = styled.div`
  padding: 1rem;
  margin: 2rem;
  background-color: #fbfbfb;
`;

export default PageConfigEliminationDetail;
