import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../../contexts/display-settings";
import { useParticipantScorings } from "../../hooks/participant-scorings";
import { useEventDetail } from "pages/dashboard/dos/hooks/event-detail";
import { useParams } from "react-router-dom";

import { LoadingFullPage } from "../loading-fullpage";
import IconLoading from "../icon-loading";
import {
  SessionCellsDataHeading,
  SessionCellsData,
} from "./components/session-cells-data";
import { CountsBySession } from "./components/counts-by-session";

import { misc } from "utils";

const PAUSE_DURATION = 2000;
const TIMER_DURATION = 5000;

function ScoringTable() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);
  const { activeCategoryDetail, sessionNumber, next } = useDisplaySettings();
  const teamType = activeCategoryDetail?.categoryTeam?.toLowerCase?.();
  const { data, isLoading, isFetching } = useParticipantScorings({
    categoryId: activeCategoryDetail.id,
    teamType,
    shouldPoll: true,
  });
  const [checkingSession, setCheckingSession] = React.useState(true);

  const hasData = Boolean(data);
  const isIndividual = teamType === "individual";
  const isTeam = teamType === "team";

  // Nge-skip yang gak ada datanya
  React.useEffect(() => {
    setCheckingSession(true);
    const noParticipantData = Array.isArray(data) && !data.length;
    if (noParticipantData) {
      next();
    } else {
      setCheckingSession(false);
    }
  }, [data]);

  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return "Kontingen";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Nge-skip yang gak ada sesinya.
  // Misal gak punya sesi 3.
  const sessions = data?.[0]?.sessions;
  React.useEffect(() => {
    setCheckingSession(true);
    if (
      isIndividual &&
      sessionNumber > 0 &&
      sessions &&
      !sessions[sessionNumber]
    ) {
      next();
    } else {
      setCheckingSession(false);
    }
  }, [isIndividual, sessions, sessionNumber]);

  if (isLoading || checkingSession) {
    return (
      <SectionTableContainer>
        <ScoringEmptyBar>
          <SpinningLoader>
            <IconLoading />
          </SpinningLoader>
        </ScoringEmptyBar>
      </SectionTableContainer>
    );
  }

  if (isIndividual) {
    return (
      <AutoScrollingContainer shouldStart={hasData}>
        <SectionTableContainer>
          <LoadingFullPage isLoading={isFetching} />
          <TableScores>
            <thead>
              <tr>
                <th>Peringkat</th>
                <th>Bantalan</th>
                <th className="text-uppercase">Nama</th>
                <th className="text-uppercase">
                  {!eventDetail
                    ? "Kontingen"
                    : capitalizeFirstLetter(
                        eventDetail.parentClassificationTitle
                      )}
                </th>
                <SessionCellsDataHeading sessions={data?.[0]?.sessions} />
                {sessionNumber === 0 && (
                  <th className="text-uppercase">Total</th>
                )}
                <th className="text-uppercase">X+10</th>
                <th className="text-uppercase">X</th>
              </tr>
            </thead>

            <tbody>
              {!data?.length ? (
                <tr>
                  <td colSpan="6">
                    <ScoringEmptyRow>
                      Belum ada data skor di kategori ini
                    </ScoringEmptyRow>
                  </td>
                </tr>
              ) : (
                data.map((scoring, index) => {
                  let contingent =
                    scoring.parentClassificationType === 1
                      ? scoring.clubName
                      : scoring.parentClassificationType === 2
                      ? scoring.countryName
                      : scoring.parentClassificationType === 3
                      ? scoring.provinceName
                      : scoring.parentClassificationType === 4
                      ? scoring.cityName
                      : scoring.childrenClassificationMembersName;

                  return (
                    <tr key={scoring.member.id}>
                      <td>
                        <DisplayRank>
                          <span>{index + 1}</span>
                        </DisplayRank>
                      </td>
                      <td>{_getBudrestNumber(scoring.member)}</td>
                      <td>
                        <NameLabel>{scoring.member.name}</NameLabel>
                      </td>
                      <td>{!contingent ? "-" : contingent}</td>
                      {/* {!eventDetail.withContingent ? (
                      <td>
                        {scoring.member.clubName || (
                          <React.Fragment>&ndash;</React.Fragment>
                        )}
                      </td>
                    ) : (
                      <td>
                        {scoring.member.cityName || (
                          <React.Fragment>&ndash;</React.Fragment>
                        )}
                      </td>
                    )} */}

                      <SessionCellsData sessions={scoring.sessions} />
                      <CountsBySession scoring={scoring} />
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableScores>
        </SectionTableContainer>
      </AutoScrollingContainer>
    );
  }

  if (isTeam) {
    return (
      <AutoScrollingContainer shouldStart={hasData}>
        <SectionTableContainer>
          <LoadingFullPage isLoading={isFetching} />

          <TableScores>
            <thead>
              <tr>
                <th>Peringkat</th>
                <th className="text-uppercase">Tim</th>
                {/* <th className="text-uppercase">Klub</th> */}
                <th className="text-uppercase">
                  {!eventDetail
                    ? "Kontingen"
                    : capitalizeFirstLetter(
                        eventDetail.parentClassificationTitle
                      )}
                </th>
                <SessionCellsDataHeading sessions={data?.[0]?.sessions} />
                <th className="text-uppercase">Total</th>
                <th className="text-uppercase">X+10</th>
                <th className="text-uppercase">X</th>
              </tr>
            </thead>

            <tbody>
              {!data?.length ? (
                <tr>
                  <td colSpan="6">
                    <ScoringEmptyRow>
                      Belum ada data skor di kategori ini
                    </ScoringEmptyRow>
                  </td>
                </tr>
              ) : (
                data.map((scoring, index) => {
                  let contingent =
                    scoring.parentClassificationType === 1
                      ? scoring.clubName
                      : scoring.parentClassificationType === 2
                      ? scoring.countryName
                      : scoring.parentClassificationType === 3
                      ? scoring.provinceName
                      : scoring.parentClassificationType === 4
                      ? scoring.cityName
                      : scoring.childrenClassificationMembersName;
                  return (
                    <tr key={scoring.participantId}>
                      <td>
                        <DisplayRank>
                          <span>{index + 1}</span>
                        </DisplayRank>
                      </td>

                      <td>
                        <TeamMembersBlock>
                          <TeamNameLabel>{scoring.team}</TeamNameLabel>
                          {scoring.teams?.length ? (
                            <ol>
                              {scoring.teams.map((member) => (
                                <li key={member.id}>{member.name}</li>
                              ))}
                            </ol>
                          ) : (
                            <EmptyMembers>
                              Belum ada data peserta anggota
                            </EmptyMembers>
                          )}
                        </TeamMembersBlock>
                      </td>

                      {/* <td>
                        {scoring.clubName || (
                          <React.Fragment>&ndash;</React.Fragment>
                        )}
                      </td> */}
                      <td>{!contingent ? "Kontingen" : contingent}</td>
                      <td>{scoring.total}</td>
                      <td>{scoring.totalXPlusTen}</td>
                      <td>{scoring.totalX}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableScores>
        </SectionTableContainer>
      </AutoScrollingContainer>
    );
  }

  return (
    <SectionTableContainer>
      <ScoringEmptyBar>Error</ScoringEmptyBar>
    </SectionTableContainer>
  );
}

function AutoScrollingContainer({ children, shouldStart, deltaY = 2 }) {
  const scrollContainerRef = React.useRef(null);
  const direction = React.useRef(1);
  const [startScrolling, setStartScrolling] = React.useState(false);
  const [timerDone, setTimerDone] = React.useState(false);
  const [scrollDone, setScrollDone] = React.useState(false);
  const { next } = useDisplaySettings();

  // Timer untuk tabel yang isinya sedikit
  // set 5 detik
  React.useEffect(() => {
    if (!shouldStart) {
      return;
    }
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, TIMER_DURATION);
    return () => clearTimeout(timer);
  }, [shouldStart]);

  // Auto start scroll ketika props true, tapi delay dulu
  React.useEffect(() => {
    if (!shouldStart) {
      // langsung pause
      setStartScrolling(false);
      return;
    }

    // delay start 2 detik
    const pause = async () => {
      await misc.sleep(PAUSE_DURATION);
      setStartScrolling(true);
    };
    pause();
  }, [shouldStart]);

  // Eksekusi auto switch kategori
  React.useEffect(() => {
    if (!shouldStart || !timerDone || !scrollDone) {
      return;
    }
    next();
  }, [shouldStart, timerDone, scrollDone]);

  // Auto scrolling bolak-balik bawah-atas
  React.useEffect(() => {
    if (!startScrolling) {
      return;
    }

    const timer = setInterval(async () => {
      if (!scrollContainerRef.current) {
        return;
      }

      const container = scrollContainerRef.current;
      direction.current *= _getDirection(container);
      container.scrollTop += direction.current * deltaY;

      if (_checkIsBottom(container)) {
        setStartScrolling(false);
        await misc.sleep(PAUSE_DURATION);
        setStartScrolling(true);
      }

      if (_checkIsFinish(container, direction.current)) {
        await misc.sleep(PAUSE_DURATION);
        setScrollDone(true);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [startScrolling]);

  return <div ref={scrollContainerRef}>{children}</div>;
}

/* ============================ */
// styles

const SectionTableContainer = styled.div`
  position: relative;
`;

const ScoringEmptyBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 30rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: #ffffff;
  color: var(--ma-blue);
`;

const SpinningLoader = styled.span`
  display: inline-block;
  animation: spin-loading 0.7s infinite linear;

  @keyframes spin-loading {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
`;

const TableScores = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.25rem;
  font-size: 1.75rem;

  thead {
    position: sticky;
    top: 0.25rem;
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
  align-items: center;
  min-height: 4rem;
  padding-left: 2rem;
`;

const NameLabel = styled.div`
  font-weight: 600;
  text-align: left;
`;

const TeamMembersBlock = styled.div`
  min-height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ol {
    margin: 0;
    margin-top: 0.5rem;
    font-size: 0.8em;
    padding-left: 1.5rem;
  }
`;

const TeamNameLabel = styled.div`
  font-weight: 600;
  text-align: left;
`;

const EmptyMembers = styled.div`
  color: var(--ma-gray-200);
`;

const ScoringEmptyRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

/* ============================== */
// utils

function _getDirection(container) {
  let dir = 1;
  const lowestScrollPos = container.scrollTop + container.offsetHeight;
  if (lowestScrollPos >= container.scrollHeight) {
    dir = -1;
  }
  return dir;
}

function _checkIsFinish(container, direction) {
  return direction === -1 && container.scrollTop === 0;
}

function _checkIsBottom(container) {
  const lowestScrollPos = container.scrollTop + container.offsetHeight;
  return lowestScrollPos === container.scrollHeight;
}

function _getBudrestNumber(member) {
  if (!member.budRestNumber || !member.targetFace) {
    return "-";
  }
  return member.budRestNumber + member.targetFace;
}

export { ScoringTable };
