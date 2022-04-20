import * as React from "react";
import styled from "styled-components";
import { useScoringMembers } from "../hooks/scoring-members";

import { ButtonGhostBlue, SpinnerDotBlock } from "components/ma";

import IconChevronLeft from "components/ma/icons/mono/chevron-left";
import IconChevronRight from "components/ma/icons/mono/chevron-right";
import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ScoringTable({ categoryDetailId }) {
  const {
    data: scoringMembers,
    isLoading: isLoadingScoringMembers,
    getSessionList,
    fetchScoringMembers,
  } = useScoringMembers(categoryDetailId);
  const sessionList = getSessionList();

  const [idActiveItem, setIdActiveItem] = React.useState(null);
  const showEditor = idActiveItem !== null;
  const isItemActive = (index) => idActiveItem === index;
  const closeEditor = () => setIdActiveItem(null);

  if (!scoringMembers && isLoadingScoringMembers) {
    return <SpinnerDotBlock />;
  }

  if (!scoringMembers?.length) {
    return <EmptyMembers>Tidak ada peserta di kategori ini</EmptyMembers>;
  }

  return (
    <TableContainer>
      <div>
        <table className="table table-responsive">
          <thead>
            <tr>
              <td>Bantalan</td>
              <td>Peringkat</td>
              <td>Nama Peserta</td>
              <td>Nama Klub</td>
              <SessionStatsColumnHeadingGroup collapsed={showEditor} sessionList={sessionList} />
              <td></td>
            </tr>
          </thead>

          <tbody>
            {scoringMembers?.map((row) => (
              <tr
                key={row.member.id}
                className={classnames({ "row-active": isItemActive(row.member.id) })}
              >
                <td>
                  <TargetFaceNumber
                    budRestNumber={row.member.budRestNumber}
                    targetFace={row.member.targetFace}
                  />
                </td>
                <td>
                  {row.rank || (
                    <GrayedOutText style={{ fontSize: "0.75em" }}>
                      belum
                      <br />
                      ada data
                    </GrayedOutText>
                  )}
                </td>
                <td>{row.member.name}</td>
                <td>
                  <ClubName>{row.clubName}</ClubName>
                </td>

                <SessionStatsCellsGroup
                  collapsed={showEditor}
                  sessions={row.sessions}
                  total={row.total}
                  totalX={row.totalX}
                  totalXPlusTen={row.totalXPlusTen}
                />

                <td>
                  {isItemActive(row.member.id) ? (
                    <ButtonGhostBlue flexible onClick={() => closeEditor()}>
                      <IconChevronLeft size="16" />
                    </ButtonGhostBlue>
                  ) : (
                    <ButtonGhostBlue flexible onClick={() => setIdActiveItem(row.member.id)}>
                      <IconChevronRight size="16" />
                    </ButtonGhostBlue>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditor && (
        <div key={`${categoryDetailId}-${idActiveItem}`}>
          <ScoreEditorContainer>
            <div>
              <SessionTabList>
                <li>50m</li>
                <li>40m</li>
                <li>30m </li>
              </SessionTabList>

              <div>
                <div>Akumulasi Skor: 360</div>
                <div>
                  <ButtonGhostBlue flexible onClick={() => closeEditor()}>
                    <IconX size="16" />
                  </ButtonGhostBlue>
                </div>
              </div>
            </div>

            <table className="table table-responsive">
              <thead>
                <tr>
                  <td>End</td>
                  <td colSpan="6">Shot</td>
                  <td>Total</td>
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4, 5, 6].map((id, indexRambahan) => (
                  <tr key={id}>
                    <td>{indexRambahan + 1}</td>

                    {[1, 2, 3, 4, 5, 6].map((id, indexShot) => (
                      <td key={id}>
                        <select
                          name={`shot-score-${indexRambahan}-${indexShot}`}
                          id={`shot-score-${indexRambahan}-${indexShot}`}
                          defaultValue={""}
                          onChange={(ev) => {
                            fetchScoringMembers();
                          }}
                        >
                          <option value="" disabled>
                            &ndash;
                          </option>
                          {["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => (
                            <option key={value} value={value}>
                              {isNaN(value) ? value.toUpperCase() : value}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}

                    <td>60</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>Total: 360</div>
          </ScoreEditorContainer>
        </div>
      )}
    </TableContainer>
  );
}

function SessionStatsColumnHeadingGroup({ collapsed, sessionList }) {
  if (collapsed) {
    return <td>Total</td>;
  }

  if (!sessionList) {
    return (
      <React.Fragment>
        <td>Total</td>
        <td>X</td>
        <td>X+10</td>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {sessionList.map((sessionNumber) => (
        <td key={sessionNumber}>Sesi {sessionNumber}</td>
      ))}
      <td>Total</td>
      <td>X</td>
      <td>X+10</td>
    </React.Fragment>
  );
}

function SessionStatsCellsGroup({ collapsed, sessions, total, totalX, totalXPlusTen }) {
  if (collapsed) {
    return <td>{total}</td>;
  }

  if (!sessions) {
    return (
      <React.Fragment>
        <td>{total}</td>
        <td>{totalX}</td>
        <td>{totalXPlusTen}</td>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {Object.keys(sessions).map((sessionNumber) => (
        <td key={sessionNumber}>
          {sessions[sessionNumber]?.total || <GrayedOutText>&ndash;</GrayedOutText>}
        </td>
      ))}
      <td>{total}</td>
      <td>{totalX}</td>
      <td>{totalXPlusTen}</td>
    </React.Fragment>
  );
}

function TargetFaceNumber({ targetFace, budRestNumber }) {
  if (!targetFace || !budRestNumber) {
    return <GrayedOutText>&ndash;</GrayedOutText>;
  }
  return <React.Fragment>{targetFace + budRestNumber}</React.Fragment>;
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

const TableContainer = styled.div`
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
    background-color: var(--ma-gray-100);
    transition: all 0.15s;
  }
`;

const ScoreEditorContainer = styled.div`
  position: sticky;
  top: var(--ma-header-height);
  bottom: 0;

  padding: 1rem;
  background-color: var(--ma-gray-100);

  > * {
    background-color: #ffffff;
  }
`;

const SessionTabList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  gap: 0.5rem;
`;

export { ScoringTable };
