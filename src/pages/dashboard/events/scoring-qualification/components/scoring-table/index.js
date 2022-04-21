import * as React from "react";
import styled from "styled-components";
import { useScoringMembers } from "../../hooks/scoring-members";

import { SpinnerDotBlock } from "components/ma";
import { ScoreEditor } from "./score-editor";

import IconChevronLeft from "components/ma/icons/mono/chevron-left";
import IconChevronRight from "components/ma/icons/mono/chevron-right";

import classnames from "classnames";

function ScoringTable({ categoryDetailId }) {
  const {
    data: scoringMembers,
    isLoading: isLoadingScoringMembers,
    getSessionNumbersList,
    fetchScoringMembers,
  } = useScoringMembers(categoryDetailId);
  const sessionNumbersList = getSessionNumbersList();

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
        <MembersTable className="table table-responsive">
          <thead>
            <tr>
              <th>Bantalan</th>
              <th>Peringkat</th>
              <th>Nama Peserta</th>
              <th>Nama Klub</th>
              <SessionStatsColumnHeadingGroup
                collapsed={showEditor}
                sessionList={sessionNumbersList}
              />
              <th></th>
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

                <CellExpander>
                  {isItemActive(row.member.id) ? (
                    <ExpanderButton flexible onClick={() => closeEditor()}>
                      <IconChevronLeft size="16" />
                    </ExpanderButton>
                  ) : (
                    <ExpanderButton flexible onClick={() => setIdActiveItem(row.member.id)}>
                      <IconChevronRight size="16" />
                    </ExpanderButton>
                  )}
                </CellExpander>
              </tr>
            ))}
          </tbody>
        </MembersTable>
      </div>

      {showEditor && (
        <div>
          <ScoreEditor
            key={`${categoryDetailId}-${idActiveItem}`}
            sessionNumbersList={sessionNumbersList}
            onSaveSuccess={fetchScoringMembers}
            onClose={() => closeEditor()}
          />
        </div>
      )}
    </TableContainer>
  );
}

function SessionStatsColumnHeadingGroup({ collapsed, sessionList }) {
  if (collapsed) {
    return <th>Total</th>;
  }

  if (!sessionList) {
    return (
      <React.Fragment>
        <th>Total</th>
        <th>X</th>
        <th>X+10</th>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {sessionList.map((sessionNumber) => (
        <th key={sessionNumber}>Sesi {sessionNumber}</th>
      ))}
      <th>Total</th>
      <th>X</th>
      <th>X+10</th>
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
  if (!budRestNumber || !targetFace) {
    return <GrayedOutText>&ndash;</GrayedOutText>;
  }
  return <React.Fragment>{budRestNumber + targetFace}</React.Fragment>;
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
    background-color: var(--ma-gray-50);
    transition: all 0.15s;
  }
`;

const MembersTable = styled.table`
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
`;

const CellExpander = styled.td`
  text-align: right;
`;

const ExpanderButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  border-radius: 1px;
  background-color: transparent;
  color: var(--ma-blue);

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-100);
  }

  &:focus {
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export { ScoringTable };
