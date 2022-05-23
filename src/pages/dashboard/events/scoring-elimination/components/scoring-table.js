import * as React from "react";
import styled from "styled-components";
import { useEliminationMatches } from "../hooks/elimination-matches";

import { SpinnerDotBlock, ButtonBlue } from "components/ma";
import { ButtonEditScoreLine } from "./button-edit-score-line";
import { ButtonDownloadScoresheet } from "./button-download-scoresheet";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";

import imgEmptyBracket from "assets/images/elimination/illustration-empty-bracket.png";

import classnames from "classnames";

function ScoringTable({ categoryDetailId, eliminationMemberCounts }) {
  const { isError, data } = useEliminationMatches(categoryDetailId, eliminationMemberCounts);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const isSettled = Boolean(data) || (!data && isError);

  if (!isSettled) {
    return (
      <SectionTableContainer>
        <SpinnerDotBlock />
      </SectionTableContainer>
    );
  }

  if (isSettled && !data) {
    return (
      <SectionTableContainer>
        <EmptyBracketContainer>
          <FloatingEmptyBracketContent>
            <div>
              <EmptyStateHeading>Bagan belum tersedia</EmptyStateHeading>
              <EmptyStateDescription>
                Maaf tidak ada klasemen dengan kategori yang Anda cari. Silakan cari dengan kategori
                lain.
              </EmptyStateDescription>
            </div>
          </FloatingEmptyBracketContent>
        </EmptyBracketContainer>
      </SectionTableContainer>
    );
  }

  // Happy path
  const tabLabels = getTabLabels(data);
  const currentRows = data[selectedTab]?.seeds || [];

  return (
    <SectionTableContainer>
      <StagesTabs
        labels={tabLabels}
        currentTab={selectedTab}
        onChange={(index) => setSelectedTab(index)}
      />

      <MembersTable className="table table-responsive">
        <thead>
          <tr>
            <th>Bantalan</th>
            <th>Nama Peserta</th>
            <th>Total</th>
            <th></th>
            <th>Total</th>
            <th>Nama Peserta</th>
            <th></th>
          </tr>
        </thead>

        <tbody key={selectedTab}>
          {currentRows.map((row, index) => {
            const player1 = row.teams[0];
            const player2 = row.teams[1];
            return (
              <tr key={index}>
                <td>
                  <InputBudrestNumber
                    type="text"
                    placeholder="-"
                    value={
                      player1.targetFace && player1.budRestNumber
                        ? player1.targetFace + player1.budRestNumber
                        : ""
                    }
                    disabled={!player1?.name || !player2?.name}
                    readOnly
                  />
                </td>

                <td>
                  <PlayerLabelContainerLeft>
                    <PlayerNameData>
                      <RankLabel>#{player1?.potition || player1?.postition || "-"}</RankLabel>
                      <NameLabel>{player1?.name || <NoArcherLabel />}</NameLabel>
                    </PlayerNameData>
                  </PlayerLabelContainerLeft>
                </td>

                <td>
                  <InlineScoreInput>
                    {false && (
                      <IndicatorIconWarning>
                        <IconAlertCircle />
                      </IndicatorIconWarning>
                    )}
                    <InputInlineScore
                      type="text"
                      placeholder="-"
                      value={player1?.result || !player1?.name ? "-" : 0}
                      disabled={!player1?.name}
                      readOnly
                    />
                  </InlineScoreInput>
                </td>

                <td>
                  <Head2HeadScoreLabels>
                    <ScoreLabelP1>{player1?.result || 0}</ScoreLabelP1>
                    <span>&ndash;</span>
                    <ScoreLabelP2>{player2?.result || 0}</ScoreLabelP2>
                  </Head2HeadScoreLabels>
                </td>

                <td>
                  <InlineScoreInput>
                    <InputInlineScore
                      type="text"
                      placeholder="-"
                      value={player2?.result || !player2?.name ? "-" : 0}
                      disabled={!player2?.name}
                      readOnly
                    />
                    {false && (
                      <IndicatorIconValid>
                        <IconCheckOkCircle />
                      </IndicatorIconValid>
                    )}
                  </InlineScoreInput>
                </td>

                <td>
                  <PlayerLabelContainerRight>
                    <PlayerNameData>
                      <RankLabel>#{player2?.potition || player2?.postition || "-"}</RankLabel>
                      <NameLabel>{player2?.name || <NoArcherLabel />}</NameLabel>
                    </PlayerNameData>
                  </PlayerLabelContainerRight>
                </td>

                <td>
                  <HorizontalSpaced>
                    <ButtonBlue flexible disabled={!player1?.name || !player2?.name}>
                      Tentukan
                    </ButtonBlue>
                    <ButtonEditScoreLine disabled={!player1?.name || !player2?.name} />
                    <ButtonDownloadScoresheet disabled={!player1?.name || !player2?.name} />
                  </HorizontalSpaced>
                </td>
              </tr>
            );
          })}
        </tbody>
      </MembersTable>
    </SectionTableContainer>
  );
}

function StagesTabs({ labels, currentTab, onChange }) {
  return (
    <StagesBarContainer>
      <StageTabsList>
        {labels.map((label, index) => (
          <li key={label}>
            <StageTabButton
              className={classnames({ "session-tab-active": index === currentTab })}
              onClick={() => onChange(index)}
            >
              <span>{label}</span>
            </StageTabButton>
          </li>
        ))}
      </StageTabsList>
    </StagesBarContainer>
  );
}

function NoArcherLabel() {
  return <NoArcherWrapper>Belum ada archer</NoArcherWrapper>;
}

/* ============================ */
// styles

const SectionTableContainer = styled.section`
  background-color: #ffffff;
`;

const InputBudrestNumber = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-400);
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
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

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const EmptyBracketContainer = styled.div`
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FloatingEmptyBracketContent = styled.div`
  max-width: 19.25rem;
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-image: url("${imgEmptyBracket}");
  background-repeat: no-repeat;
  background-position: top center;

  text-align: center;
`;

const EmptyStateHeading = styled.h4`
  color: var(--ma-blue);
  font-weight: 600;
`;

const EmptyStateDescription = styled.p`
  color: var(--ma-gray-600);
`;

const StagesBarContainer = styled.div`
  padding: 1rem;
`;

const StageTabsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  gap: 0.5rem;
`;

const StageTabButton = styled.button`
  display: block;
  border: none;
  padding: 0 0.5rem;
  background-color: transparent;

  min-width: 6rem;
  color: var(--ma-gray-400);
  font-size: 0.875rem;
  font-weight: 600;

  transition: all 0.15s;

  > span {
    display: block;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 0.25rem 0;

    &::before {
      content: " ";
      position: absolute;
      height: 2px;
      top: 0;
      left: 0;
      width: 1.5rem;
      background-color: transparent;
      transition: all 0.3s;
      transform: scaleX(0);
      transform-origin: left;
    }
  }

  &:hover {
    color: var(--ma-blue);
  }

  &.session-tab-active {
    color: var(--ma-blue);

    > span {
      &::before {
        background-color: #90aad4;
        transform: scaleX(1);
      }
    }
  }
`;

const MembersTable = styled.table`
  --indicator-space-margin: 3rem;
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;
    }
  }

  tbody td {
    vertical-align: middle;
  }

  th,
  td {
    cursor: auto;
  }
`;

const PlayerLabelContainerLeft = styled.div`
  margin-right: var(--indicator-space-margin);
`;

const PlayerLabelContainerRight = styled.div`
  margin-left: var(--indicator-space-margin);
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
`;

const NameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;
`;

const NoArcherWrapper = styled.span`
  color: var(--ma-gray-200);
  font-weight: 400;
`;

const Head2HeadScoreLabels = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ScoreLabelP1 = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-secondary);
  white-space: nowrap;
`;

const ScoreLabelP2 = styled(ScoreLabelP1)`
  background-color: var(--ma-gray-200);
`;

/* =========================== */
// utils

const tabLabels = {
  16: "32 Besar",
  8: "16 Besar",
  4: "8 Besar",
  2: "Semi-Final",
};

function getTabLabels(bracketTemplate) {
  if (!bracketTemplate) {
    return [];
  }

  let finalHasTaken = false;
  const labels = bracketTemplate.map((round) => {
    const matchCount = round.seeds.length;
    if (matchCount > 1) {
      return tabLabels[matchCount];
    }
    if (!finalHasTaken) {
      finalHasTaken = true;
      return "Final";
    }
    return "3rd Place";
  });

  return labels;
}

export { ScoringTable };
