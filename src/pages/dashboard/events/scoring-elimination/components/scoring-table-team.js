import * as React from "react";
import styled from "styled-components";
import { useEliminationMatches } from "../hooks/elimination-matches";
import { useDownloadBlankScoresheet } from "../hooks/download-blank-scoresheet";
import { useDownloadScoresheetByRound } from "../hooks/download-scoresheet-by-round";

import { SpinnerDotBlock } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { useFilters } from "components/ma/toolbar-filters";
import { TableViewToolbar } from "./table-view-toolbar";
import { ScoresheetMenus } from "./scoresheet-menus";
import { BudrestInputAsync } from "./table-budrest-input-async";
import { TotalInputAsync } from "./table-total-input-async";
import { ButtonEditScoreTeam } from "./button-edit-score-line-team";
import { ButtonSetWinner, ButtonCancelWinner } from "./button-set-winner";
import { ButtonDownloadScoresheet } from "./button-download-scoresheet";

import IconBudrest from "components/ma/icons/mono/bud-rest";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";

import imgEmptyBracket from "assets/images/elimination/illustration-empty-bracket.png";

import classnames from "classnames";

function ScoringTableTeam({ categoryDetailId, eliminationMemberCounts }) {
  const { categoryDetail: categoryDetails } = useFilters();
  const { isError, data, fetchEliminationMatches } = useEliminationMatches(
    categoryDetailId,
    eliminationMemberCounts
  );
  const [selectedTab, setSelectedTab] = React.useState(0);

  const isSettled = Boolean(data || (!data && isError));
  const currentRows = isSettled ? data.rounds[selectedTab]?.seeds : [];
  const roundNumber = selectedTab + 1;

  const { download: downloadByRound } = useDownloadScoresheetByRound({
    categoryId: categoryDetailId,
    eliminationId: data?.eliminationGroupId,
    round: roundNumber,
  });

  const { download: downloadBlank } = useDownloadBlankScoresheet({ categoryId: categoryDetailId });

  // TODO: kapan-kapan ganti `!isSettled` jadi pakai `isInitialLoading` dari fetcher
  if (!isSettled) {
    return (
      <SectionTableContainer>
        <SpinnerDotBlock />
      </SectionTableContainer>
    );
  }

  // Tabel dirender sebagai "state kosong" ketika:
  // 1. belum menentukan jumlah peserta eliminasi di page skoring kualifikasi (belum ada ID eliminasi/`eliminationId`)
  // 2. belum menentukan bagan eliminasi (terlempar error)
  if (!data?.eliminationGroupId) {
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

  return (
    <SectionTableContainer>
      <TableViewToolbar
        rounds={data.rounds}
        selectedTab={selectedTab}
        onChangeTab={(index) => setSelectedTab(index)}
        viewRight={
          <div>
            <ScoresheetMenus
              label="Scoresheet"
              displayAsButtonList
              options={[
                {
                  label: "Cetak Scoresheet Kosong",
                  onClick: () => {
                    toast.loading("Sedang menyiapkan file scoresheet...");
                    downloadBlank({
                      onSuccess: () => {
                        toast.dismiss();
                        toast.success("Unduhan dimulai");
                      },
                      onError: () => {
                        toast.dismiss();
                        toast.error("Gagal memulai unduhan");
                      },
                    });
                  },
                },
                {
                  label: "Unduh Semua Scoresheet",
                  onClick: () => {
                    toast.loading("Sedang menyiapkan file scoresheet...");
                    downloadByRound({
                      onSuccess: () => {
                        toast.dismiss();
                        toast.success("Unduhan dimulai");
                      },
                      onError: () => {
                        toast.dismiss();
                        toast.error("Gagal memulai unduhan");
                      },
                    });
                  },
                },
              ]}
            />
          </div>
        }
      />

      <MembersTable className="table table-responsive">
        <thead>
          <tr>
            <th>
              <BudrestColumnIconWrapper>
                <IconBudrest />
              </BudrestColumnIconWrapper>
            </th>
            <th>Tim</th>
            <ThTotal>{_getTotalLabel(categoryDetails)}</ThTotal>
            <th></th>
            <ThTotal>{_getTotalLabel(categoryDetails)}</ThTotal>
            <th>Tim</th>
            <th>
              <BudrestColumnIconWrapper>
                <IconBudrest />
              </BudrestColumnIconWrapper>
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody key={selectedTab}>
          {currentRows.map((row, index) => (
            <MatchRow
              key={index}
              categoryDetailId={categoryDetailId}
              categoryDetails={categoryDetails}
              bracket={data}
              row={row}
              roundNumber={roundNumber}
              matchNumber={index + 1}
              fetchEliminationMatches={fetchEliminationMatches}
            />
          ))}
        </tbody>
      </MembersTable>
    </SectionTableContainer>
  );
}

function MatchRow({
  categoryDetailId,
  categoryDetails,
  row,
  fetchEliminationMatches,
  bracket,
  roundNumber,
  matchNumber,
}) {
  const team1 = row.teams[0];
  const team2 = row.teams[1];

  const code = `2-${bracket?.eliminationGroupId}-${matchNumber}-${roundNumber}-t`;

  const scoring = {
    code: code,
    elimination_id: bracket?.eliminationGroupId,
    round: roundNumber,
    match: matchNumber,
  };

  const isBye =
    row.teams.some((team) => team.status === "bye") ||
    (roundNumber === 1 && row.teams.every((team) => !team.teamName));
  const noData =
    !team1?.teamName ||
    !team2?.teamName ||
    !team1?.memberTeam?.length ||
    !team2?.memberTeam?.length;
  const bothAreBye = row.teams.every((team) => team.status === "wait");
  const hasWinner = row.teams.some((team) => team.win === 1);
  const budrestNumber = _getBudrestNumber(row);

  return (
    <tr>
      <td>
        {isBye || noData || hasWinner ? (
          <BudrestNumberLabel>{budrestNumber}</BudrestNumberLabel>
        ) : (
          <BudrestInputAsync
            categoryId={categoryDetailId}
            playerDetail={team1}
            disabled={hasWinner || noData}
            scoring={scoring}
            participantId={team1?.participantId}
            onSuccess={fetchEliminationMatches}
          />
        )}
      </td>

      <td>
        <PlayerLabelContainerLeft>
          <PlayerNameData>
            {team1?.potition && <RankLabel>#{team1?.potition || "-"}</RankLabel>}
            <div>
              <TeamNameLabel>
                {team1?.teamName || <NoArcherTeamLabel isBye={isBye} />}
              </TeamNameLabel>
              {Boolean(team1?.memberTeam?.length) && (
                <MembersList>
                  {team1.memberTeam.map((member) => (
                    <li key={member.memberId}>{member.name}</li>
                  ))}
                </MembersList>
              )}
            </div>
          </PlayerNameData>
        </PlayerLabelContainerLeft>
      </td>

      <td>
        {!noData && !hasWinner ? (
          <InlineScoreInput>
            <ValidationIndicator position="left" isValid={team1?.isDifferent !== 1} />
            <TotalInputAsync
              categoryId={categoryDetailId}
              playerDetail={team1}
              disabled={hasWinner || !team1?.teamName}
              scoring={scoring}
              onSuccess={fetchEliminationMatches}
            />
          </InlineScoreInput>
        ) : (
          <NoArcherWrapper>-</NoArcherWrapper>
        )}
      </td>

      <td>
        {(!noData || (!bothAreBye && isBye)) && (
          <HeadToHeadScoreLabels>
            <ScoreTotalLabel
              className={classnames({
                "score-label-higher":
                  team1?.status === "win" || team1?.adminTotal > team2?.adminTotal,
              })}
            >
              {team1?.adminTotal || 0}
            </ScoreTotalLabel>

            <span>&ndash;</span>

            <ScoreTotalLabel
              className={classnames({
                "score-label-higher":
                  team2?.status === "win" || team2?.adminTotal > team1?.adminTotal,
              })}
            >
              {team2?.adminTotal || 0}
            </ScoreTotalLabel>
          </HeadToHeadScoreLabels>
        )}
      </td>

      <td>
        {!noData && !hasWinner ? (
          <InlineScoreInput>
            <TotalInputAsync
              categoryId={categoryDetailId}
              playerDetail={team2}
              disabled={hasWinner || !team2?.teamName}
              scoring={scoring}
              onSuccess={fetchEliminationMatches}
            />
            <ValidationIndicator position="right" isValid={team2?.isDifferent !== 1} />
          </InlineScoreInput>
        ) : (
          <NoArcherWrapper>-</NoArcherWrapper>
        )}
      </td>

      <td>
        <PlayerLabelContainerRight>
          <PlayerNameData>
            {team2?.potition && <RankLabel>#{team2?.potition || "-"}</RankLabel>}
            <div>
              <TeamNameLabel>
                {team2?.teamName || <NoArcherTeamLabel isBye={isBye} />}
              </TeamNameLabel>
              {Boolean(team2?.memberTeam?.length) && (
                <MembersList>
                  {team2.memberTeam.map((member) => (
                    <li key={member.memberId}>{member.name}</li>
                  ))}
                </MembersList>
              )}
            </div>
          </PlayerNameData>
        </PlayerLabelContainerRight>
      </td>

      <td>
        {isBye || noData || hasWinner ? (
          <BudrestNumberLabel>{budrestNumber}</BudrestNumberLabel>
        ) : (
          <BudrestInputAsync
            categoryId={categoryDetailId}
            playerDetail={team2}
            disabled={hasWinner || noData}
            scoring={scoring}
            participantId={team2?.participantId}
            onSuccess={fetchEliminationMatches}
          />
        )}
      </td>

      <td>
        <HorizontalSpaced>
          {!isBye &&
            (!hasWinner ? (
              <React.Fragment>
                <ButtonSetWinner
                  title={
                    hasWinner ? "Pemenang telah ditentukan" : "Tentukan pemenang untuk match ini"
                  }
                  disabled={noData}
                  categoryId={categoryDetailId}
                  scoring={scoring}
                  onSuccess={fetchEliminationMatches}
                >
                  Tentukan
                </ButtonSetWinner>

                <ButtonEditScoreTeam
                  disabled={noData}
                  headerInfo={row}
                  budrestNumber={budrestNumber}
                  scoring={scoring}
                  onSuccessSubmit={fetchEliminationMatches}
                  categoryDetails={categoryDetails}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ButtonCancelWinner
                  title="Batalkan pemenang untuk mengubah skor kembali"
                  scoring={scoring}
                  categoryId={categoryDetailId}
                  onSuccess={fetchEliminationMatches}
                />

                <ButtonEditScoreTeam
                  disabled={noData}
                  viewMode
                  headerInfo={row}
                  budrestNumber={budrestNumber}
                  scoring={scoring}
                  onSuccessSubmit={fetchEliminationMatches}
                  categoryDetails={categoryDetails}
                />
              </React.Fragment>
            ))}

          {isBye && (
            <ButtonEditScoreTeam
              headerInfo={row}
              budrestNumber={budrestNumber}
              scoring={scoring}
              onSuccessSubmit={fetchEliminationMatches}
              categoryDetails={categoryDetails}
            />
          )}

          <ButtonDownloadScoresheet categoryId={categoryDetailId} scoring={scoring} />
        </HorizontalSpaced>
      </td>
    </tr>
  );
}

function NoArcherTeamLabel({ isBye }) {
  if (isBye) {
    return <NoArcherWrapper>&#171; bye &#187;</NoArcherWrapper>;
  }
  return <NoArcherWrapper>&#171; Belum ada tim &#187;</NoArcherWrapper>;
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

const ThTotal = styled.th`
  white-space: nowrap;
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
    padding: 0.25rem 0.25rem;
    vertical-align: middle;
  }

  th,
  td {
    cursor: auto;
  }
`;

const BudrestColumnIconWrapper = styled.span`
  color: var(--ma-red);
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

const RankLabel = styled.div`
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-primary-blue-50);
  white-space: nowrap;
  font-weight: 600;
`;

const TeamNameLabel = styled.div`
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

const NoArcherWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  width: 100%;
  min-height: 4.625rem;
  color: var(--ma-gray-400);
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

function _getTotalLabel(categoryDetails) {
  if (!categoryDetails?.competitionCategoryId) {
    return "Total";
  }
  const TYPE_POINT = "Total Set Poin";
  const TYPE_ACCUMULATION = "Total Skor";
  return categoryDetails.competitionCategoryId.toLowerCase() === "compound"
    ? TYPE_ACCUMULATION
    : TYPE_POINT;
}

export { ScoringTableTeam };
