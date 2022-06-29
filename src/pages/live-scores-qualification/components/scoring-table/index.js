import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../../contexts/display-settings";
import { useParticipantScorings } from "../../hooks/participant-scorings";

import { SessionCellsDataHeading, SessionCellsData } from "./components/session-cells-data";

function ScoringTable({ categoryDetail, onEmptyData }) {
  const teamType = categoryDetail?.categoryTeam?.toLowerCase?.();

  const { data, isLoading, isFetching } = useParticipantScorings({
    categoryId: categoryDetail.id,
    teamType,
    shouldPoll: true,
  });

  // Nge-skip yang gak ada datanya
  React.useEffect(() => {
    if (!data || data.length) {
      return;
    }
    onEmptyData?.();
  }, [data]);

  const hasData = Boolean(data);

  if (isLoading) {
    // TODO: pakai UI table yang aslinya
    return (
      <div
        style={{
          overflow: "auto",
          height: 400,
          textAlign: "left",
          fontSize: "0.875rem",
          fontweight: 400,
        }}
      >
        Loading...
      </div>
    );
  }

  if (teamType === "individual") {
    return (
      <SectionTableContainer>
        <div style={{ opacity: isFetching ? 1 : 0 }}>Refetching...</div>

        <TableScores>
          <thead>
            <tr>
              <th>Peringkat</th>
              <th className="text-uppercase">Nama</th>
              <th className="text-uppercase">Klub</th>
              <SessionCellsDataHeading sessions={data?.[0]?.sessions} />
              <th className="text-uppercase">Total</th>
              <th className="text-uppercase">X</th>
              <th className="text-uppercase">X+10</th>
            </tr>
          </thead>

          <ScrollTBody shouldStart={hasData}>
            {!data?.length ? (
              <tr>
                <td colSpan="6">
                  <ScoringEmptyRow>Belum ada data skor di kategori ini</ScoringEmptyRow>
                </td>
              </tr>
            ) : (
              data.map((scoring, index) => (
                <tr key={scoring.member.id}>
                  <td>
                    <DisplayRank>
                      <span>{index + 1}</span>
                    </DisplayRank>
                  </td>
                  <td>{scoring.member.name}</td>
                  <td>{scoring.member.clubName || <React.Fragment>&ndash;</React.Fragment>}</td>

                  <SessionCellsData sessions={scoring.sessions} />

                  <td>{scoring.total}</td>
                  <td>{scoring.totalX}</td>
                  <td>{scoring.totalXPlusTen}</td>
                </tr>
              ))
            )}
          </ScrollTBody>
        </TableScores>
      </SectionTableContainer>
    );
  }

  if (teamType === "team") {
    return (
      <SectionTableContainer>
        <div style={{ opacity: isFetching ? 1 : 0 }}>Refetching...</div>
        {/* <FullPageLoadingIndicator isLoading={isLoading} /> */}

        <TableScores>
          <thead>
            <tr>
              <th>Peringkat</th>
              <th className="text-uppercase">Nama Tim</th>
              <th className="text-uppercase">Klub</th>
              <SessionCellsDataHeading sessions={data?.[0]?.sessions} />
              <th className="text-uppercase">Total</th>
              <th className="text-uppercase">X</th>
              <th className="text-uppercase">X+10</th>
            </tr>
          </thead>

          <ScrollTBody shouldStart={hasData}>
            {!data?.length ? (
              <tr>
                <td colSpan="6">
                  <ScoringEmptyRow>Belum ada data skor di kategori ini</ScoringEmptyRow>
                </td>
              </tr>
            ) : (
              data.map((scoring, index) => (
                <tr key={scoring.participantId}>
                  <td>
                    <DisplayRank>
                      <span>{index + 1}</span>
                    </DisplayRank>
                  </td>

                  <td>
                    <div>
                      <h3>{scoring.team}</h3>
                      {Boolean(scoring.teams?.length) && (
                        <ol>
                          {scoring.teams.map((member) => (
                            <li key={member.id}>{member.name}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </td>

                  <td>{scoring.clubName || <React.Fragment>&ndash;</React.Fragment>}</td>
                  <td>{scoring.total}</td>
                  <td>{scoring.totalX}</td>
                  <td>{scoring.totalXPlusTen}</td>
                </tr>
              ))
            )}
          </ScrollTBody>
        </TableScores>
      </SectionTableContainer>
    );
  }

  // TODO: hapus atau ganti error handling
  return (
    <React.Fragment>
      <div style={{ opacity: isFetching ? 1 : 0 }}>Refetching...</div>
      <table className="table bg-dark text-light">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No</th>
            <th>Nama</th>
            <th>No</th>
            <th>Nama</th>
          </tr>
        </thead>

        <ScrollTBody shouldStart={hasData}>
          {data?.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.team || row.member?.name || "no name"}</td>
              <td>{index + 1}</td>
              <td>{row.team || row.member?.name || "no name"}</td>
              <td>{index + 1}</td>
              <td>{row.team || row.member?.name || "no name"}</td>
            </tr>
          ))}
        </ScrollTBody>
      </table>
    </React.Fragment>
  );
}

function ScrollTBody({ children, shouldStart }) {
  const scrollContainerRef = React.useRef(null);
  const dirRef = React.useRef(1);
  const [timerDone, setTimerDone] = React.useState(false);
  const [scrollDone, setScrollDone] = React.useState(false);
  const { next } = useDisplaySettings();

  React.useEffect(() => {
    if (!shouldStart) {
      return;
    }
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [shouldStart]);

  React.useEffect(() => {
    if (!shouldStart || !timerDone || !scrollDone) {
      return;
    }
    next();
  }, [shouldStart, timerDone, scrollDone]);

  React.useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const timer = setInterval(() => {
      const container = scrollContainerRef.current;

      const lowestScrollPos = container.scrollTop + container.offsetHeight;
      if (lowestScrollPos >= container.scrollHeight) {
        dirRef.current *= -1;
      }

      container.scrollTop += dirRef.current * 20;

      if (dirRef.current === -1 && container.scrollTop === 0) {
        setScrollDone(true);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [shouldStart]);

  return <tbody ref={scrollContainerRef}>{children}</tbody>;
}

const SectionTableContainer = styled.div`
  position: relative;
`;

const TableScores = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.25rem;
  font-size: calc(0.875rem * 2);

  thead,
  tbody,
  tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  tbody {
    table-layout: fixed;
    display: block;
    overflow-y: auto;
    width: 100%;
    max-height: 600px;
    text-align: left;
    font-weight: 400;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  th,
  td {
    cursor: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  thead > tr > th {
    padding: 0.75rem;
    background-color: var(--ma-primary-blue-50);
  }

  tbody > tr > td {
    padding: 0.8125rem 0.625rem;
    background-color: #ffffff;
    font-size: 0.875em;
  }
`;

const DisplayRank = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ScoringEmptyRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export { ScoringTable };
