import * as React from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEventDetail } from "./hooks/event-detail";
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
import {
  ButtonOutlineBlue,
  SpinnerDotBlock,
  AlertSubmitError,
} from "components/ma";
import { BreadcrumbDashboard } from "../../../components/breadcrumb";
import { FieldSelectOption } from "./field-select-option";
import { ScoringEditor } from "./scoring-editor";

import IconCheck from "components/ma/icons/fill/check";

import { StyledPageWrapper } from "./styles";

import classnames from "classnames";
import { shouldDisableEditing } from "./utils";

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

  const { data: eventDetail } = useEventDetail(eventId);
  const [eliminationMemberCount, setEliminationMemberCount] = React.useState(
    amountOptions[0]
  );
  const [scoringType, setScoringType] = React.useState(null);
  const [formStatus, dispatchFormStatus] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    { status: "idle", errors: null }
  );

  const { data: matchTemplate, fetchMatchTemplate } = useMatchTemplate({
    event_category_id: category.id,
    elimination_member_count: eliminationMemberCount.value,
  });

  const refetchMatchTemplate = () => {
    // TODO: const options = {}
    fetchMatchTemplate();
  };

  React.useEffect(() => {
    if (matchTemplate) {
      let arrData = [];
      let rowTwo = 0;
      let titleLabel = "";
      matches.rounds.map((val) => {
        switch (val.seeds.length) {
          case 8:
            titleLabel = "1/8";
            break;
          case 4:
            titleLabel = "1/4";
            break;
          case 2:
            titleLabel = "Semi-Final";
            break;
          case 1:
            if (rowTwo < 1) {
              rowTwo = 1;
              titleLabel = "Final";
            } else {
              titleLabel = "3rd Place";
            }
            break;

          default:
            titleLabel = "1/16";
            break;
        }
        let obj = {
          round: val.round,
          seeds: val.seeds,
          title: (
            <span className="badge bg-primary rounded-pill fs-6">
              {titleLabel}
            </span>
          ),
        };

        return arrData.push(obj);
      });
      matchTemplate.rounds = arrData;
    }
  }, [matchTemplate]);

  React.useEffect(() => {
    refetchMatchTemplate();
  }, [eliminationMemberCount, scoringType]);

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

  const handleSuccessSave = () => refetchMatchTemplate();

  const isLoadingApply = formStatus.status === "loading";
  const editIsDisabled = shouldDisableEditing(
    eventDetail?.publicInformation.eventEnd
  );

  return (
    <React.Fragment>
      <MetaTags>
        <title>Atur Jadwal dan Skor Pertandingan | MyArchery.id</title>
      </MetaTags>

      <StyledPageWrapper>
        <Container fluid>
          <BreadcrumbDashboard
            to={
              location.state.from ||
              `/dashboard/event/${eventId}/scheduling-scoring`
            }
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
                      !matchTemplate?.updated
                        ? defaultEmptyOption
                        : eliminationMemberCount
                    }
                    options={amountOptions}
                    onChange={(option) => setEliminationMemberCount(option)}
                  >
                    Jumlah Peserta Eliminasi
                  </FieldSelectOption>

                  <FieldSelectOption
                    placeholder="Pilih jenis sistem scoring"
                    disabled={!matchTemplate?.updated}
                    value={
                      matchTemplate?.updated && scoringType
                        ? scoringType
                        : defaultEmptyOption
                    }
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
                    disabled={editIsDisabled || !matchTemplate?.updated}
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
                  {matchTemplate ? (
                    !matchTemplate.updated ? (
                      <OverflowingBracketContent>
                        <Bracket
                          rounds={matchTemplate.rounds || []}
                          renderSeedComponent={(bracketProps) => (
                            <SeedBagan
                              bracketProps={bracketProps}
                              configs={{
                                editIsAllowed: !editIsDisabled,
                                isSettingApplied: !matchTemplate.updated,
                                totalRounds: matchTemplate.rounds.length - 1,
                                eliminationId: matchTemplate.eliminationId,
                              }}
                              onSuccess={handleSuccessSave}
                            />
                          )}
                        />
                      </OverflowingBracketContent>
                    ) : (
                      <OverflowingBracketContent>
                        <TitlePreviewBracket>Pratinjau</TitlePreviewBracket>
                        <Bracket
                          rounds={matchTemplate.rounds || []}
                          renderSeedComponent={(bracketProps) => (
                            <SeedBagan
                              bracketProps={bracketProps}
                              configs={{
                                editIsAllowed: !editIsDisabled,
                                isSettingApplied: false,
                                totalRounds: matchTemplate.rounds.length - 1,
                                eliminationId: matchTemplate.eliminationId,
                              }}
                              onSuccess={handleSuccessSave}
                            />
                          )}
                        />
                      </OverflowingBracketContent>
                    )
                  ) : (
                    <SettingsNotApplied>
                      <SpinnerDotBlock />
                    </SettingsNotApplied>
                  )}
                </MatchBracketContainer>
              </SplitPanelContent>
            </BracketPanelCard>
          </ContentSection>
        </Container>

        <LoadingScreen loading={isLoadingApply} />
        <AlertSubmitError
          isError={formStatus.status === "error"}
          errors={formStatus.errors}
        />
      </StyledPageWrapper>
    </React.Fragment>
  );
}

function SeedBagan({ bracketProps, configs, onSuccess }) {
  const { roundIndex, seedIndex, seed, breakpoint } = bracketProps;

  const isFinalRound =
    (configs.totalRounds === 4 && roundIndex === 3) ||
    (configs.totalRounds === 3 && roundIndex === 2);
  const isThirdPlaceRound =
    (configs.totalRounds === 4 && roundIndex === 4) ||
    (configs.totalRounds === 3 && roundIndex === 3);

  const shouldEnableScoring = () => {
    const noWinnersYet = seed.teams.every((team) => team.win === 0);
    return configs.editIsAllowed && configs.isSettingApplied && noWinnersYet;
  };

  const code = `2-${configs.eliminationId}-${seedIndex + 1}-${roundIndex + 1}`;
  const isBye = seed.teams.some((team) => team.status === "bye");

  return (
    <Seed
      mobileBreakpoint={breakpoint}
      className={classnames({
        "round-final": isFinalRound,
        "round-third-place": isThirdPlaceRound,
      })}
    >
      <SeedItem>
        <ItemContainer>
          {isFinalRound && <FinalHeading>Medali Emas</FinalHeading>}
          {isThirdPlaceRound && <FinalHeading>Medali Perunggu</FinalHeading>}
          {<FloatingCodeDisplay>Kode: {code || "-"}</FloatingCodeDisplay>}
          {seed.teams.map((team, index) => (
            <SeedTeam
              key={index}
              className={classnames({
                "item-active": shouldEnableScoring(),
                "item-winner":
                  configs.isSettingApplied &&
                  parseInt(team.win) === 1 &&
                  !isBye,
              })}
            >
              <BoxName>{team.name || "-"}</BoxName>
              {typeof team.result === "number" && (
                <BoxScore>{team.result}</BoxScore>
              )}
            </SeedTeam>
          ))}

          {shouldEnableScoring() && (
            <FloatingControl>
              <ScoringEditor
                code={code}
                bracketProps={bracketProps}
                configs={configs}
                onSuccess={onSuccess}
              />
            </FloatingControl>
          )}
        </ItemContainer>
      </SeedItem>
    </Seed>
  );
}

const FinalHeading = styled.h6`
  position: absolute;
  top: -3.6em;
  left: 0;
  right: 0;
  font-weight: 600;
  text-align: center;
`;

const Seed = styled(RBSeed)`
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.round-third-place {
    margin-left: 3.75rem;
  }
`;

const SeedItem = styled(RBSeedItem)`
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--ma-primary-blue-50);
`;

const SeedTeam = styled(RBSeedTeam)`
  gap: 0.25rem;
  padding: 0.5rem;
  border: solid 2px #757575;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: var(--bs-body-color);
  font-size: var(--bs-body-font-size);

  &.item-active {
    border-color: #0d47a1;
  }

  &.item-winner {
    border-color: var(--ma-blue);
    background-color: #bc8b2c;
    color: #000000;
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

  .item-winner & {
    background-color: #000000;
  }
`;

const FloatingCodeDisplay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-65%);
  color: var(--ma-gray-500);
  font-size: 0.875em;
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

const TitlePreviewBracket = styled.h5`
  color: var(--ma-gray-400);
`;

export default PageConfigEliminationDetail;
