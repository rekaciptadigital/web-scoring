import * as React from "react";
import styled from "styled-components";
import { useEliminationMatches } from "../hooks/elimination-matches";
import { useDownloadBlankScoresheet } from "../hooks/download-blank-scoresheet";
import { useDownloadScoresheetByRound } from "../hooks/download-scoresheet-by-round";

import { SpinnerDotBlock } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { TableViewToolbar } from "./table-view-toolbar";
import { ScoresheetMenus } from "./scoresheet-menus";
import { BudrestInputAsync } from "./table-budrest-input-async";
import { TotalInputAsync } from "./table-total-input-async";
import { ButtonEditScoreLine } from "./button-edit-score-line";
import { ButtonDownloadScoresheet } from "./button-download-scoresheet";
import { ButtonSetWinner, ButtonCancelWinner } from "./button-set-winner";

import IconBudrest from "components/ma/icons/mono/bud-rest";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";

import imgEmptyBracket from "assets/images/elimination/illustration-empty-bracket.png";

import classnames from "classnames";

function ScoringTable({ categoryDetailId, categoryDetails, eliminationMemberCounts }) {
  const { isError, data, fetchEliminationMatches } = useEliminationMatches(
    categoryDetailId,
    eliminationMemberCounts
  );

  const [selectedTab, setSelectedTab] = React.useState(0);
  const isSettled = Boolean(data) || (!data && isError);
  const currentRows = isSettled ? data.rounds[selectedTab]?.seeds : [];
  const roundNumber = selectedTab + 1;

  const { download: downloadByRound } = useDownloadScoresheetByRound({
    categoryId: categoryDetailId,
    eliminationId: data?.eliminationId,
    round: roundNumber,
  });

  const { download: downloadBlank } = useDownloadBlankScoresheet({ categoryId: categoryDetailId });

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
            <th>Nama Peserta</th>
            <ThTotal>{_getTotalLabel(categoryDetails)}</ThTotal>
            <th></th>
            <ThTotal>{_getTotalLabel(categoryDetails)}</ThTotal>
            <th>Nama Peserta</th>
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
  const player1 = row.teams[0];
  const player2 = row.teams[1];

  const code = `2-${bracket.eliminationId}-${matchNumber}-${roundNumber}`;

  const scoring = {
    code: code,
    elimination_id: bracket.eliminationId,
    round: roundNumber,
    match: matchNumber,
  };

  const isBye =
    row.teams.some((team) => team.status === "bye") ||
    (roundNumber === 1 && row.teams.every((team) => !team.name));
  const noData = !player1?.name || !player2?.name;
  const bothAreBye = noData && row.teams.every((team) => team.status === "wait");
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
            playerDetail={player1}
            disabled={hasWinner || noData}
            scoring={scoring}
            memberId={player1?.id}
            onSuccess={fetchEliminationMatches}
          />
        )}
      </td>

      <td>
        <PlayerLabelContainerLeft>
          <PlayerNameData>
            {player1?.potition && <RankLabel>#{player1?.potition || "-"}</RankLabel>}
            <NameLabel>{player1?.name || <NoArcherLabel isBye={isBye} />}</NameLabel>
          </PlayerNameData>
        </PlayerLabelContainerLeft>
      </td>

      <td>
        {!noData && !hasWinner ? (
          <InlineScoreInput>
            <ValidationIndicator position="left" isValid={player1?.isDifferent !== 1} />
            <TotalInputAsync
              categoryId={categoryDetailId}
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
        {(!noData || (!bothAreBye && isBye)) && (
          <HeadToHeadScoreLabels>
            <ScoreTotalLabel
              className={classnames({
                "score-label-higher":
                  player1?.status === "win" || player1?.adminTotal > player2?.adminTotal,
              })}
            >
              {player1?.adminTotal || 0}
            </ScoreTotalLabel>

            <span>&ndash;</span>

            <ScoreTotalLabel
              className={classnames({
                "score-label-higher":
                  player2?.status === "win" || player2?.adminTotal > player1?.adminTotal,
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
              categoryId={categoryDetailId}
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
            {player2?.potition && <RankLabel>#{player2?.potition || "-"}</RankLabel>}
            <NameLabel>{player2?.name || <NoArcherLabel isBye={isBye} />}</NameLabel>
          </PlayerNameData>
        </PlayerLabelContainerRight>
      </td>

      {isBye || noData || hasWinner ? (
        <BudrestNumberLabel>{budrestNumber}</BudrestNumberLabel>
      ) : (
        <BudrestInputAsync
          categoryId={categoryDetailId}
          playerDetail={player2}
          disabled={hasWinner || noData}
          scoring={scoring}
          memberId={player2?.id}
          onSuccess={fetchEliminationMatches}
        />
      )}

      <td>
        <HorizontalSpaced>
          {!isBye &&
            (!hasWinner ? (
              <React.Fragment>
                <ButtonSetWinner
                  title="Tentukan pemenang untuk match ini"
                  disabled={noData}
                  scoring={scoring}
                  categoryId={categoryDetailId}
                  onSuccess={fetchEliminationMatches}
                >
                  Tentukan
                </ButtonSetWinner>

                <ButtonEditScoreLine
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

                <ButtonEditScoreLine
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
            <ButtonEditScoreLine
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

function NoArcherLabel({ isBye }) {
  if (isBye) {
    return <NoArcherWrapper>&#171; bye &#187;</NoArcherWrapper>;
  }
  return <NoArcherWrapper>&#171; Belum ada archer &#187;</NoArcherWrapper>;
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

const BudrestColumnIconWrapper = styled.span`
  color: var(--ma-red);
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

const RankLabel = styled.div`
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-primary-blue-50);
  white-space: nowrap;
  font-weight: 600;
`;

const NameLabel = styled.div`
  font-weight: 600;
  text-align: left;
`;

const NoArcherWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  width: 100%;
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

export { ScoringTable };
