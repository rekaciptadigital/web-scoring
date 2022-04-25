import * as React from "react";
import styled from "styled-components";
import { useScoringMembers } from "../../hooks/scoring-members";
import { useSubmitScore } from "../../hooks/submit-score";

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

  const [editor, dispatchEditor] = React.useReducer(editorReducer, defaultEditorState);
  const { editorValue, selectedMemberId } = editor;

  // di-memo jaga-jaga kalau row-nya banyak & rerendernya juga banyak
  const activeRow = React.useMemo(() => {
    if (!scoringMembers || !selectedMemberId) {
      return null;
    }
    return scoringMembers.find((row) => row.member.id === selectedMemberId);
  }, [scoringMembers, selectedMemberId]);

  const sessionNumbersList = getSessionNumbersList();
  const showEditor = activeRow !== null;
  const isItemActive = (memberId) => activeRow?.member?.id === memberId;

  const { submitScore, isLoading: isSaving } = useSubmitScore();

  const handleChangeEditor = (editorValue) => {
    dispatchEditor({ type: "UPDATE_EDITOR_VALUE", payload: editorValue });
  };

  const handleSelectRow = (rowData) => {
    if (editorValue?.isDirty) {
      const payload = {
        code: editorValue.sessionCode,
        shoot_scores: editorValue.value,
      };

      submitScore(payload, {
        onSuccess() {
          dispatchEditor({ type: "SELECT_ROW", payload: rowData.member.id });
          fetchScoringMembers();
        },
        onError() {
          // TODO: prompt retry / switch without saving anyway
        },
      });
    } else {
      dispatchEditor({ type: "SELECT_ROW", payload: rowData.member.id });
    }
  };

  const handleCollapseEditor = () => {
    if (editorValue?.isDirty) {
      const payload = {
        code: editorValue.sessionCode,
        shoot_scores: editorValue.value,
      };

      submitScore(payload, {
        onSuccess() {
          dispatchEditor({ type: "CLOSED" });
          fetchScoringMembers();
        },
        onError() {
          // TODO: prompt retry / switch without saving anyway
        },
      });
    } else {
      dispatchEditor({ type: "CLOSED" });
    }
  };

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
              <th className="name">Nama Peserta</th>
              <th className="name">Nama Klub</th>
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
                <td className="name">{row.member.name}</td>
                <td className="name">
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
                    <ExpanderButton flexible onClick={handleCollapseEditor}>
                      <IconChevronLeft size="16" />
                    </ExpanderButton>
                  ) : (
                    <ExpanderButton flexible onClick={() => handleSelectRow(row)}>
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
            key={`${categoryDetailId}-${activeRow.member.id}`}
            memberId={activeRow.member.id}
            sessionNumbersList={sessionNumbersList}
            scoreTotal={activeRow.total}
            isLoading={isSaving}
            onChange={handleChangeEditor}
            onSaveSuccess={fetchScoringMembers}
            onClose={() => dispatchEditor({ type: "CLOSED" })}
          />
        </div>
      )}
    </TableContainer>
  );
}

function SessionStatsColumnHeadingGroup({ collapsed, sessionList }) {
  if (collapsed) {
    return <th className="stats">Total</th>;
  }

  if (!sessionList) {
    return (
      <React.Fragment>
        <th className="stats">Total</th>
        <th className="stats">X</th>
        <th className="stats">X+10</th>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {sessionList.map((sessionNumber) => (
        <th key={sessionNumber} className="stats">
          Sesi {sessionNumber}
        </th>
      ))}
      <th className="stats">Total</th>
      <th className="stats">X</th>
      <th className="stats">X+10</th>
    </React.Fragment>
  );
}

function SessionStatsCellsGroup({ collapsed, sessions, total, totalX, totalXPlusTen }) {
  if (collapsed) {
    return <td className="stats">{total}</td>;
  }

  if (!sessions) {
    return (
      <React.Fragment>
        <td className="stats">{total}</td>
        <td className="stats">{totalX}</td>
        <td className="stats">{totalXPlusTen}</td>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {Object.keys(sessions).map((sessionNumber) => (
        <td key={sessionNumber} className="stats">
          {sessions[sessionNumber]?.total || <GrayedOutText>&ndash;</GrayedOutText>}
        </td>
      ))}
      <td className="stats">{total}</td>
      <td className="stats">{totalX}</td>
      <td className="stats">{totalXPlusTen}</td>
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

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-100);
  }

  &:focus {
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

/* =========================== */

const defaultEditorState = { selectedMemberId: null, editorValue: null };

function editorReducer(state, action) {
  switch (action.type) {
    case "CLOSED": {
      return defaultEditorState;
    }

    case "SELECT_ROW": {
      return { ...defaultEditorState, selectedMemberId: action.payload };
    }

    case "UPDATE_SELECTED_ROW": {
      return { ...state, selectedMemberId: action.payload };
    }

    case "UPDATE_EDITOR_VALUE": {
      return { ...state, editorValue: action.payload };
    }

    default: {
      return state;
    }
  }
}

export { ScoringTable };
