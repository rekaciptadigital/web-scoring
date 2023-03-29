import * as React from "react";
import styled from "styled-components";
import { useScoringMembers } from "../../hooks/scoring-members";
import { LoadingScreen, SpinnerDotBlock } from "components/ma";

function ScoringTeamTable({
  categoryDetailId,
  eliminationParticipantsCount,
  searchName,
  isTeam,
  eventDetail,
}) {
  React.useEffect(() => {}, [eventDetail]);

  const {
    data: scoringMembers,
    isLoading: isLoadingScoringMembers,
    isError: isErrorScoringMembers,
    getSessionNumbersList,
  } = useScoringMembers(
    categoryDetailId,
    searchName,
    eliminationParticipantsCount,
    isTeam
  );
  const isSettledScoringMembers =
    scoringMembers || (!scoringMembers && isErrorScoringMembers);

  const sessionNumbersList = getSessionNumbersList();

  if (!isSettledScoringMembers) {
    return <SpinnerDotBlock />;
  }

  if (!scoringMembers?.length) {
    return <EmptyMembers>Tidak ada peserta di kategori ini</EmptyMembers>;
  }

  return (
    <React.Fragment>
      <LoadingScreen />

      <TableContainer>
        <div>
          <LoadingBlocker isLoading={isLoadingScoringMembers} />
          <MembersTable className="table table-responsive">
            <thead>
              <tr>
                <th>Peringkat</th>
                <th className="name">Tim</th>
                <th className="name">
                  Kontingen
                  {/* {!eventDetail.withContingent ? "Klub" : "Kontingen"} */}
                </th>
                <SessionStatsColumnHeadingGroup
                  sessionList={sessionNumbersList}
                />
                <th></th>
              </tr>
            </thead>

            <tbody>
              {scoringMembers?.map((row) => {
                return (
                  <tr key={row?.clubId}>
                    <td>
                      {row?.rank || (
                        <GrayedOutText style={{ fontSize: "0.75em" }}>
                          belum
                          <br />
                          ada data
                        </GrayedOutText>
                      )}
                    </td>
                    <td className="name">{row?.team}</td>
                    <td className="name">
                      {/* {!eventDetail.withContingent ? (
                        <ClubName>{row?.clubName}</ClubName>
                      ) : (
                        <ClubName>{row?.cityName}</ClubName>
                      )} */}
                      {row.parentClassificationType === 1 ? (
                        <ClubName>{row?.clubName}</ClubName>
                      ) : row.parentClassificationType === 2 ? (
                        <ClubName>{row?.countryName}</ClubName>
                      ) : row.parentClassificationType === 3 ? (
                        <ClubName>{row?.provinceName}</ClubName>
                      ) : row.parentClassificationType === 4 ? (
                        <ClubName>{row?.cityName}</ClubName>
                      ) : (
                        <ClubName>
                          {row?.childrenClassificationMembersName}
                        </ClubName>
                      )}
                    </td>

                    <SessionStatsCellsGroup
                      sessions={row?.sessions}
                      sessionNumbersList={sessionNumbersList}
                      total={row?.total}
                      totalX={row?.totalX}
                      totalXPlusTen={row?.totalXPlusTen}
                    />
                  </tr>
                );
              })}
            </tbody>
          </MembersTable>
        </div>
      </TableContainer>
    </React.Fragment>
  );
}

function SessionStatsColumnHeadingGroup({ sessionList }) {
  if (!sessionList) {
    return (
      <React.Fragment>
        <th className="stats">Total</th>
        <th className="stats">X+10</th>
        <th className="stats">X</th>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <th className="stats">Total</th>
      <th className="stats">X+10</th>
      <th className="stats">X</th>
    </React.Fragment>
  );
}

function SessionStatsCellsGroup({
  sessions,
  sessionNumbersList,
  total,
  totalX,
  totalXPlusTen,
}) {
  if (!sessions) {
    return (
      <React.Fragment>
        <td className="stats">{total}</td>
        <td className="stats">{totalXPlusTen}</td>
        <td className="stats">{totalX}</td>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {sessionNumbersList.map((sessionNumber) => (
        <td key={sessionNumber} className="stats">
          {<span>{sessions[sessionNumber]?.total}</span> || (
            <GrayedOutText>&ndash;</GrayedOutText>
          )}
        </td>
      ))}
      <td className="stats">{total}</td>
      <td className="stats">{totalXPlusTen}</td>
      <td className="stats">{totalX}</td>
    </React.Fragment>
  );
}

function ClubName({ children, clubName }) {
  if (!children && !clubName) {
    return <GrayedOutText>&ndash;</GrayedOutText>;
  }
  return children || clubName;
}

function LoadingBlocker({ isLoading = true }) {
  if (!isLoading) {
    return null;
  }
  return (
    <LoadingContainer>
      <SpinnerDotBlock />
    </LoadingContainer>
  );
}

/* =============================== */
// styles

const GrayedOutText = styled.span`
  color: var(--ma-gray-400);
`;

const EmptyMembers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.5rem;
  color: var(--ma-gray-400);
  font-weight: 600;
`;

const TableContainer = styled.div`
  position: relative;
  display: flex;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }

  .row-active {
    position: sticky;
    top: var(--ma-header-height);
    bottom: 0;
    background-color: var(--ma-gray-50);
    transition: all 0.15s;
  }
`;

const MembersTable = styled.table`
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;
      text-transform: uppercase;

      &.name {
        text-align: left;
      }

      &.stats {
        text-align: right;
      }
    }
  }

  tbody td {
    vertical-align: middle;

    &.name {
      text-align: left;
    }

    &.stats {
      text-align: right;
    }
  }

  th,
  td {
    cursor: auto;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.6);
`;

export { ScoringTeamTable };
