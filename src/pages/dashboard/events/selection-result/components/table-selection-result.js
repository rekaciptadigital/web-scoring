import * as React from "react";
import styled from "styled-components";
import { useSelectionResult } from "../hooks/selection-result";

import { SpinnerDotBlock, AlertSubmitError } from "components/ma";

import IconMedal from "components/ma/icons/fill/medal-gold";

function TableSelectionResult({ categoryDetailId, standing }) {
  const {
    data: resultRows,
    isInitialLoading,
    isError,
    errors,
    sessionNumbersList,
    sessionEliminationNumbersList,
  } = useSelectionResult({ categoryDetailId, standing });

  return (
    <AsyncViewWrapper isLoading={isInitialLoading} isError={isError} errors={errors}>
      {!resultRows?.length ? (
        <EmptyMembers>Tidak ada peserta di kategori ini</EmptyMembers>
      ) : (
        <TableContainer>
          <MembersTable className="table table-responsive">
            <thead>
              <tr>
                <th title="Peringkat">
                  <IconMedal />
                </th>
                <th className="name">Nama</th>
                <th className="name">Klub</th>

                <SessionStatsColumnHeadingGroup
                  standing={standing}
                  sessionList={sessionNumbersList}
                  sessionEliminationList={sessionEliminationNumbersList}
                />
              </tr>
            </thead>

            <tbody>
              {resultRows?.map((row, index) => {
                const rankNumber = index + 1;
                return (
                  <tr key={row.member.id}>
                    <td>
                      {rankNumber || (
                        <GrayedOutText style={{ fontSize: "0.75em" }}>
                          belum
                          <br />
                          ada data
                        </GrayedOutText>
                      )}
                    </td>

                    <td className="name">{row.member.name}</td>
                    <td className="name">
                      <ClubName>{row.clubName}</ClubName>
                    </td>

                    <SessionStatsCellsGroup
                      standing={standing}
                      sessionNumbersList={sessionNumbersList}
                      sessionEliminationList={sessionEliminationNumbersList}
                      sessions={row.qualification?.sessions || row.sessions}
                      sessionsElimination={row.elimination?.sessions || row.sessions}
                      totalQual={row.qualification?.total || row.total}
                      totalEli={row.elimination?.total || row.total}
                      totalIrat={row.allTotalIrat || row.totalIrat}
                    />
                  </tr>
                );
              })}
            </tbody>
          </MembersTable>
        </TableContainer>
      )}
    </AsyncViewWrapper>
  );
}

function AsyncViewWrapper({ children, isLoading, isError, errors }) {
  if (isLoading) {
    return <SpinnerDotBlock />;
  }

  if (isError) {
    return (
      <React.Fragment>
        <ErrorMembers>
          <div>
            <p>Gagal mengambil data</p>
          </div>
        </ErrorMembers>
        <AlertSubmitError isError={isError} errors={errors} />
      </React.Fragment>
    );
  }

  return children;
}

function SessionStatsColumnHeadingGroup({ standing, sessionList, sessionEliminationList }) {
  return (
    <React.Fragment>
      {(standing === 3 || standing === 0) &&
        sessionList?.map((sessionNumber) => (
          <th key={sessionNumber} className="stats">
            Sesi {sessionNumber}
          </th>
        ))}

      {standing === 0 && <th className="stats">Total-Kual</th>}

      {(standing === 4 || standing === 0) &&
        sessionEliminationList?.map((eliminasiNumber) => (
          <th key={eliminasiNumber} className="stats">
            Eli-{eliminasiNumber}
          </th>
        ))}

      <th className="stats">{standing === 0 ? "Total-Eli" : "Total"}</th>
      <th className="stats">IRAT</th>
    </React.Fragment>
  );
}

function SessionStatsCellsGroup({
  standing,
  sessions,
  sessionNumbersList,
  totalQual,
  sessionsElimination,
  sessionEliminationList,
  totalEli,
  totalIrat,
}) {
  return (
    <React.Fragment>
      {(standing === 3 || standing === 0) &&
        sessionNumbersList?.map((sessionNumber) => (
          <td key={sessionNumber} className="stats">
            {<span>{sessions[sessionNumber]?.total}</span> || (
              <GrayedOutText>&ndash;</GrayedOutText>
            )}
          </td>
        ))}

      {standing === 0 && <td className="stats total">{totalQual}</td>}

      {(standing === 4 || standing === 0) &&
        sessionEliminationList?.map((eliminationNumber) => (
          <td key={eliminationNumber} className="stats">
            {<span>{sessionsElimination[eliminationNumber]?.total}</span> || (
              <GrayedOutText>&ndash;</GrayedOutText>
            )}
          </td>
        ))}

      <td className="stats total">{totalEli}</td>
      <td className="stats irat">{totalIrat}</td>
    </React.Fragment>
  );
}

function ClubName({ children, clubName }) {
  if (!children && !clubName) {
    return <GrayedOutText>&ndash;</GrayedOutText>;
  }
  return children || clubName;
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

const ErrorMembers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.5rem;
  color: var(--ma-gray-400);
  font-weight: 600;
  text-align: center;

  .error-fetching {
    text-align: left;
  }
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

    &.total {
      background-color: var(--ma-gray-50);
    }

    &.irat {
      font-weight: 600;
      color: var(--ma-txt-black);
    }
  }

  th,
  td {
    cursor: auto;
  }
`;

export { TableSelectionResult };
