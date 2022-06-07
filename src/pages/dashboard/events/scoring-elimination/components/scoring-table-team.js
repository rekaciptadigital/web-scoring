import * as React from "react";
import styled from "styled-components";
import { useEliminationMatches } from "../hooks/elimination-matches";

import { SpinnerDotBlock } from "components/ma";
import { BudrestInputAsync } from "./table-budrest-input-async";
import { TotalInputAsync } from "./table-total-input-async";
import { ButtonEditScoreTeam } from "./button-edit-score-line-team";
import { ButtonSetWinner } from "./button-set-winner";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";

import imgEmptyBracket from "assets/images/elimination/illustration-empty-bracket.png";

import classnames from "classnames";

function ScoringTableTeam({ categoryDetailId, categoryDetails, eliminationMemberCounts }) {
  const { isError, data, fetchEliminationMatches } = useEliminationMatches(
    categoryDetailId,
    eliminationMemberCounts
  );

  const [selectedTab, setSelectedTab] = React.useState(0);
  const isSettled = Boolean(data) || (!data && isError);

  if (!isSettled) {
    return (
      <SectionTableContainer>
        <SpinnerDotBlock />
      </SectionTableContainer>
    );
  }

  const isDebugging = true;

  if (isDebugging) {
    return (
      <SectionTableContainer>
        <div>debugging</div>

        <StagesTabs
          labels={["1 Besar", "2 Kecil", "Apa", "Itu?", "Aaaa..."]}
          currentTab={selectedTab}
          onChange={(index) => setSelectedTab(index)}
        />

        <MembersTable className="table table-responsive">
          <thead>
            <tr>
              <th>Bantalan</th>
              <th>Tim</th>
              <th>Total</th>
              <th></th>
              <th>Total</th>
              <th>Tim</th>
              <th></th>
            </tr>
          </thead>

          <tbody key={selectedTab}>
            {fakeRows.map((row, index) => {
              const player1 = row.teams[0];
              const player2 = row.teams[1];

              const roundNumber = selectedTab + 1;
              const matchNumber = index + 1;

              // TODO: elimination ID
              const code = `2-${data?.eliminationId || 333}-${matchNumber}-${roundNumber}`;

              const scoring = {
                code: code,
                // TODO: elimination ID
                elimination_id: data?.eliminationId || 333,
                round: roundNumber,
                match: matchNumber,
              };

              const noData = false;
              const hasWinner = false;
              const budrestNumber = "10A";

              return (
                <tr key={index}>
                  <td>
                    {noData || hasWinner ? (
                      <BudrestNumberLabel>{budrestNumber}</BudrestNumberLabel>
                    ) : (
                      <BudrestInputAsync
                        playerDetail={player1 || player2}
                        disabled={hasWinner || noData}
                        scoring={scoring}
                        onSuccess={fetchEliminationMatches}
                      />
                    )}
                  </td>

                  <td>
                    <PlayerLabelContainerLeft>
                      <PlayerNameData>
                        {(player1?.potition || player1?.postition) && (
                          <RankLabel>#{player1?.potition || player1?.postition || "-"}</RankLabel>
                        )}
                        <div>
                          <TeamNameLabel>{player1?.name || <NoArcherLabel />}</TeamNameLabel>
                          <MembersList>
                            <li>Anggota satu</li>
                            <li>Anggota dua</li>
                            <li>Anggota tigaaa</li>
                          </MembersList>
                        </div>
                      </PlayerNameData>
                    </PlayerLabelContainerLeft>
                  </td>

                  <td>
                    {!noData && !hasWinner ? (
                      <InlineScoreInput>
                        <ValidationIndicator position="left" isValid={player1?.isDifferent !== 1} />
                        <TotalInputAsync
                          playerDetail={player1}
                          disabled={hasWinner || !player1?.name}
                          scoring={scoring}
                          onSuccess={fetchEliminationMatches}
                        />
                      </InlineScoreInput>
                    ) : (
                      <NoArcherWrapper>-</NoArcherWrapper>
                    )}
                  </td>

                  <td>
                    {!noData && (
                      <HeadToHeadScoreLabels>
                        <ScoreTotalLabel
                          className={classnames({
                            "score-label-higher": player1?.adminTotal > player2?.adminTotal,
                          })}
                        >
                          {player1?.adminTotal || 0}
                        </ScoreTotalLabel>

                        <span>&ndash;</span>

                        <ScoreTotalLabel
                          className={classnames({
                            "score-label-higher": player2?.adminTotal > player1?.adminTotal,
                          })}
                        >
                          {player2?.adminTotal || 0}
                        </ScoreTotalLabel>
                      </HeadToHeadScoreLabels>
                    )}
                  </td>

                  <td>
                    {!noData && !hasWinner ? (
                      <InlineScoreInput>
                        <TotalInputAsync
                          playerDetail={player2}
                          disabled={hasWinner || !player2?.name}
                          scoring={scoring}
                          onSuccess={fetchEliminationMatches}
                        />
                        <ValidationIndicator
                          position="right"
                          isValid={player2?.isDifferent !== 1}
                        />
                      </InlineScoreInput>
                    ) : (
                      <NoArcherWrapper>-</NoArcherWrapper>
                    )}
                  </td>

                  <td>
                    <PlayerLabelContainerRight>
                      <PlayerNameData>
                        {(player2?.potition || player2?.postition) && (
                          <RankLabel>#{player2?.potition || player2?.postition || "-"}</RankLabel>
                        )}
                        <div>
                          <TeamNameLabel>{player2?.name || <NoArcherLabel />}</TeamNameLabel>
                          <MembersList>
                            <li>Anggota satu</li>
                            <li>Anggota dua</li>
                            <li>Anggota tigaaa</li>
                          </MembersList>
                        </div>
                      </PlayerNameData>
                    </PlayerLabelContainerRight>
                  </td>

                  <td>
                    <HorizontalSpaced>
                      {!hasWinner && (
                        <ButtonSetWinner
                          title={
                            hasWinner
                              ? "Pemenang telah ditentukan"
                              : "Tentukan pemenang untuk match ini"
                          }
                          disabled={noData}
                          scoring={scoring}
                          onSuccess={fetchEliminationMatches}
                        >
                          Tentukan
                        </ButtonSetWinner>
                      )}

                      {!hasWinner && (
                        <ButtonEditScoreTeam
                          disabled={noData}
                          headerInfo={row}
                          budrestNumber={budrestNumber}
                          scoring={scoring}
                          onSuccessSubmit={fetchEliminationMatches}
                          categoryDetails={categoryDetails}
                        />
                      )}
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

  // Tabel dirender sebagai "state kosong" ketika:
  // 1. belum menentukan jumlah peserta eliminasi di page skoring kualifikasi (belum ada ID eliminasi/`eliminationId`)
  // 2. belum menentukan bagan eliminasi (terlempar error)
  if (!data?.eliminationId) {
    return (
      <SectionTableContainer>
        <EmptyBracketContainer>
          <FloatingEmptyBracketContent>
            <div>
              <EmptyStateHeading>Data tidak tersedia</EmptyStateHeading>
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
  const tabLabels = _getTabLabels(data.rounds);
  const currentRows = data.rounds[selectedTab]?.seeds || [];

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

            const roundNumber = selectedTab + 1;
            const matchNumber = index + 1;
            const code = `2-${data.eliminationId}-${matchNumber}-${roundNumber}`;

            const scoring = {
              code: code,
              elimination_id: data.eliminationId,
              round: roundNumber,
              match: matchNumber,
            };

            const noData = !player1?.name || !player2?.name;
            const hasWinner = row.teams.some((team) => team.win === 1);
            const budrestNumber = _getBudrestNumber(row);

            return (
              <tr key={index}>
                <td>
                  {noData || hasWinner ? (
                    <BudrestNumberLabel>{budrestNumber}</BudrestNumberLabel>
                  ) : (
                    <BudrestInputAsync
                      playerDetail={player1 || player2}
                      disabled={hasWinner || noData}
                      scoring={scoring}
                      onSuccess={fetchEliminationMatches}
                    />
                  )}
                </td>

                <td>
                  <PlayerLabelContainerLeft>
                    <PlayerNameData>
                      {(player1?.potition || player1?.postition) && (
                        <RankLabel>#{player1?.potition || player1?.postition || "-"}</RankLabel>
                      )}
                      <TeamNameLabel>{player1?.name || <NoArcherLabel />}</TeamNameLabel>
                    </PlayerNameData>
                  </PlayerLabelContainerLeft>
                </td>

                <td>
                  {!noData && !hasWinner ? (
                    <InlineScoreInput>
                      <ValidationIndicator position="left" isValid={player1?.isDifferent !== 1} />
                      <TotalInputAsync
                        playerDetail={player1}
                        disabled={hasWinner || !player1?.name}
                        scoring={scoring}
                        onSuccess={fetchEliminationMatches}
                      />
                    </InlineScoreInput>
                  ) : (
                    <NoArcherWrapper>-</NoArcherWrapper>
                  )}
                </td>

                <td>
                  {!noData && (
                    <HeadToHeadScoreLabels>
                      <ScoreTotalLabel
                        className={classnames({
                          "score-label-higher": player1?.adminTotal > player2?.adminTotal,
                        })}
                      >
                        {player1?.adminTotal || 0}
                      </ScoreTotalLabel>

                      <span>&ndash;</span>

                      <ScoreTotalLabel
                        className={classnames({
                          "score-label-higher": player2?.adminTotal > player1?.adminTotal,
                        })}
                      >
                        {player2?.adminTotal || 0}
                      </ScoreTotalLabel>
                    </HeadToHeadScoreLabels>
                  )}
                </td>

                <td>
                  {!noData && !hasWinner ? (
                    <InlineScoreInput>
                      <TotalInputAsync
                        playerDetail={player2}
                        disabled={hasWinner || !player2?.name}
                        scoring={scoring}
                        onSuccess={fetchEliminationMatches}
                      />
                      <ValidationIndicator position="right" isValid={player2?.isDifferent !== 1} />
                    </InlineScoreInput>
                  ) : (
                    <NoArcherWrapper>-</NoArcherWrapper>
                  )}
                </td>

                <td>
                  <PlayerLabelContainerRight>
                    <PlayerNameData>
                      {(player2?.potition || player2?.postition) && (
                        <RankLabel>#{player2?.potition || player2?.postition || "-"}</RankLabel>
                      )}
                      <TeamNameLabel>{player2?.name || <NoArcherLabel />}</TeamNameLabel>
                    </PlayerNameData>
                  </PlayerLabelContainerRight>
                </td>

                <td>
                  <HorizontalSpaced>
                    {!hasWinner && (
                      <ButtonSetWinner
                        title={
                          hasWinner
                            ? "Pemenang telah ditentukan"
                            : "Tentukan pemenang untuk match ini"
                        }
                        disabled={noData}
                        scoring={scoring}
                        onSuccess={fetchEliminationMatches}
                      >
                        Tentukan
                      </ButtonSetWinner>
                    )}

                    {!hasWinner && (
                      <ButtonEditScoreTeam
                        disabled={noData}
                        headerInfo={row}
                        budrestNumber={budrestNumber}
                        scoring={scoring}
                        onSuccessSubmit={fetchEliminationMatches}
                        categoryDetails={categoryDetails}
                      />
                    )}
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

function ValidationIndicator({ position, isValid }) {
  const getClassNameProp = () => ({
    className: classnames({
      "indicator-left": position === "left",
      "indicator-right": position === "right",
    }),
  });

  if (!isValid) {
    return (
      <IndicatorIconWarning
        title="Hasil input dengan total poin belum sesuai, cek detail skoring"
        {...getClassNameProp()}
      >
        <IconAlertCircle />
      </IndicatorIconWarning>
    );
  }
  return (
    <IndicatorIconValid title="Total skor sesuai dengan detailnya" {...getClassNameProp()}>
      <IconCheckOkCircle />
    </IndicatorIconValid>
  );
}

/* ============================ */
// styles

const SectionTableContainer = styled.section`
  background-color: #ffffff;
`;

const BudrestNumberLabel = styled.div`
  width: 3rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
`;

const InlineScoreInput = styled.div`
  position: relative;
`;

const IndicatorIconWarning = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  color: var(--ma-secondary);

  &.indicator-left {
    left: -1.75rem;
  }

  &.indicator-right {
    right: -1.75rem;
  }
`;

const IndicatorIconValid = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  color: var(--ma-alert-positive);

  &.indicator-left {
    left: -1.75rem;
  }

  &.indicator-right {
    right: -1.75rem;
  }
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
  gap: 1rem;
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

const TeamNameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;
`;

const MembersList = styled.ol`
  margin: 0;
  margin-top: 0.5rem;
  padding-left: 1rem;
  text-align: left;
  font-size: 0.625rem;
`;

const NoArcherWrapper = styled.span`
  color: var(--ma-gray-200);
  font-weight: 400;
`;

const HeadToHeadScoreLabels = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ScoreTotalLabel = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-gray-200);
  white-space: nowrap;

  &.score-label-higher {
    background-color: var(--ma-secondary);
  }
`;

/* =========================== */
// utils

const tabLabels = {
  16: "32 Besar",
  8: "16 Besar",
  4: "8 Besar",
  2: "Semi-Final",
};

function _getTabLabels(bracketTemplate) {
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

function _getBudrestNumber(row) {
  if (!row?.teams?.length) {
    return "-";
  }

  const player1 = row.teams[0];
  const player2 = row.teams[1];

  if (player1?.budrestNumber) {
    return player1.budrestNumber;
  }

  if (player2?.budrestNumber) {
    return player2.budrestNumber;
  }

  return "-";
}

export { ScoringTableTeam };

const fakeRows = [
  {
    date: "  - ",
    teams: [
      {
        id: 1265,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 1,
        win: 1,
        totalScoring: 10,
        status: "win",
        adminTotal: 16,
        budrestNumber: "10A",
        isDifferent: 1,
      },
      {
        id: 1709,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 8,
        win: 0,
        totalScoring: 20,
        status: "wait",
        adminTotal: 13,
        budrestNumber: "10A",
        isDifferent: 1,
      },
    ],
  },
  {
    date: "  - ",
    teams: [
      {
        id: 931,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 5,
        win: 0,
        totalScoring: 100,
        status: "wait",
        adminTotal: 101,
        budrestNumber: "10B",
        isDifferent: 1,
      },
      {
        id: 891,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 4,
        win: 1,
        totalScoring: 0,
        status: "win",
        adminTotal: 151,
        budrestNumber: "10B",
        isDifferent: 1,
      },
    ],
  },
  {
    date: "  - ",
    teams: [
      {
        id: 1174,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 3,
        win: 0,
        totalScoring: 0,
        status: "wait",
        adminTotal: 20,
        budrestNumber: "12B",
        isDifferent: 1,
      },
      {
        id: 1004,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 6,
        win: 1,
        totalScoring: 0,
        status: "win",
        adminTotal: 201,
        budrestNumber: "12B",
        isDifferent: 1,
      },
    ],
  },
  {
    date: "  - ",
    teams: [
      {
        id: 1724,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 7,
        win: 0,
        totalScoring: 28,
        status: "wait",
        adminTotal: 29,
        budrestNumber: "1B",
        isDifferent: 1,
      },
      {
        id: 1115,
        name: "Nama Tim",
        gender: "male",
        club: null,
        potition: 2,
        win: 1,
        totalScoring: 30,
        status: "win",
        adminTotal: 31,
        budrestNumber: "1B",
        isDifferent: 1,
      },
    ],
  },
];
