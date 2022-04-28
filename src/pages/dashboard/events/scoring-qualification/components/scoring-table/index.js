import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useScoringMembers } from "../../hooks/scoring-members";
import { useScoreEditor } from "../../hooks/score-editor";
import { useParticipantPresence } from "../../hooks/participant-presence";
import { useSubmitScore } from "../../hooks/submit-score";
import { toast } from "../processing-toast";

import { LoadingScreen, SpinnerDotBlock, AlertConfirmAction } from "components/ma";
import { Checkbox } from "../../../components/form-fields";
import { ScoreEditor } from "./score-editor";

import IconChevronLeft from "components/ma/icons/mono/chevron-left";
import IconChevronRight from "components/ma/icons/mono/chevron-right";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import classnames from "classnames";

function ScoringTable({
  categoryDetailId,
  eliminationParticipantsCount,
  onChangeParticipantPresence,
  searchName,
}) {
  const { event_id } = useParams();
  const eventId = event_id;

  const {
    data: scoringMembers,
    isLoading: isLoadingScoringMembers,
    isSearchMode,
    getSessionNumbersList,
    fetchScoringMembers,
  } = useScoringMembers(categoryDetailId, searchName, eliminationParticipantsCount);
  const { submitParticipantPresence, isLoading: isLoadingCheckPresence } = useParticipantPresence();
  const {
    isEditorOpen,
    activeRow,
    editorValue,
    checkIsRowActive,
    selectRow,
    closeEditor,
    updateEditorValue,
  } = useScoreEditor(scoringMembers, isSearchMode);
  const { submitScore, isLoading: isSaving } = useSubmitScore();

  const sessionNumbersList = getSessionNumbersList();

  const _getParamEliminationTemplate = (count) => {
    if (editorValue.sessionNumber !== 11) {
      return;
    }
    return count;
  };

  const handleClickSelectRow = (rowData) => {
    if (!editorValue?.isDirty) {
      selectRow(rowData.member.id);
      return;
    }

    const payload = {
      code: editorValue.sessionCode,
      shoot_scores: editorValue.value,
      elimination_template: _getParamEliminationTemplate(eliminationParticipantsCount),
    };

    submitScore(payload, {
      onSuccess() {
        selectRow(rowData.member.id);
        fetchScoringMembers();
      },
      onError() {
        // TODO: prompt retry / switch without saving anyway
      },
    });
  };

  const handleCollapseEditor = () => {
    if (!editorValue?.isDirty) {
      closeEditor();
      return;
    }

    const payload = {
      code: editorValue.sessionCode,
      shoot_scores: editorValue.value,
    };

    submitScore(payload, {
      onSuccess() {
        closeEditor();
        fetchScoringMembers();
      },
      onError() {
        // TODO: prompt retry / switch without saving anyway
      },
    });
  };

  const checkPresenceByRow = (row) => {
    const params = {
      eventId,
      participantId: row.member.participantId,
      isPresent: row.member.isPresent ? 0 : 1,
    };

    submitParticipantPresence(params, {
      onSuccess() {
        const message = row.member.isPresent
          ? "Peserta tidak diikutkan dalam eliminasi"
          : "Peserta diikutkan dalam eliminasi";
        toast.success(message);

        // let's just take it for granted, for a moment
        // hard to explain
        onChangeParticipantPresence?.(); // <- ini akan otomatis trigger refetch scoring member, yang bawah `false`
        if (!eliminationParticipantsCount || eliminationParticipantsCount === 16) {
          fetchScoringMembers(); // <- akan trigger refetch scoring member kalau jumlah peserta gak berubah
        }
      },
    });
  };

  if (!scoringMembers && isLoadingScoringMembers) {
    return <SpinnerDotBlock />;
  }

  if (!scoringMembers?.length) {
    return <EmptyMembers>Tidak ada peserta di kategori ini</EmptyMembers>;
  }

  return (
    <React.Fragment>
      <LoadingScreen loading={isLoadingCheckPresence} />

      <TableContainer>
        <div>
          <LoadingBlocker isLoading={isLoadingScoringMembers} />
          <MembersTable className="table table-responsive">
            <thead>
              <tr>
                <th>Bantalan</th>
                <th>Peringkat</th>
                <th className="name">Nama Peserta</th>
                <th className="name">Nama Klub</th>
                <SessionStatsColumnHeadingGroup
                  collapsed={isEditorOpen}
                  sessionList={sessionNumbersList}
                />
                <th></th>
              </tr>
            </thead>

            <tbody>
              {scoringMembers?.map((row) => (
                <tr
                  key={row.member.id}
                  className={classnames({ "row-active": checkIsRowActive(row.member.id) })}
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
                    collapsed={isEditorOpen}
                    sessions={row.sessions}
                    total={row.total}
                    totalX={row.totalX}
                    totalXPlusTen={row.totalXPlusTen}
                  />

                  <td>
                    <CellExpander>
                      {parseInt(row.haveShootOff) === 1 && (
                        <WarningIconWrapper title="Peringkat terbawah memiliki skor yang sama">
                          <IconAlertCircle />
                        </WarningIconWrapper>
                      )}

                      <CheckboxWithPrompt
                        disabled={isEditorOpen}
                        checked={row.member.isPresent}
                        onChange={() => checkPresenceByRow(row)}
                        title={
                          row.member.isPresent
                            ? "Hapus centang untuk tidak mengikutkan dalam eliminasi"
                            : "Centang untuk mengikutkan dalam eliminasi"
                        }
                      />

                      {checkIsRowActive(row.member.id) ? (
                        <ExpanderButton flexible onClick={handleCollapseEditor}>
                          <IconChevronLeft size="16" />
                        </ExpanderButton>
                      ) : (
                        <ExpanderButton
                          flexible
                          onClick={() => handleClickSelectRow(row)}
                          disabled={!row.member.isPresent}
                        >
                          <IconChevronRight size="16" />
                        </ExpanderButton>
                      )}
                    </CellExpander>
                  </td>
                </tr>
              ))}
            </tbody>
          </MembersTable>
        </div>

        <ScoreEditor
          key={`${categoryDetailId}-${activeRow?.member.id}`}
          isOpen={isEditorOpen}
          memberId={activeRow?.member.id}
          sessionNumbersList={sessionNumbersList}
          scoreTotal={activeRow?.total}
          hasShootOff={parseInt(activeRow?.haveShootOff) === 1}
          isLoading={isSaving}
          onChange={updateEditorValue}
          onSaveSuccess={fetchScoringMembers}
          onClose={() => closeEditor()}
        />
      </TableContainer>
    </React.Fragment>
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
          {<span>{sessions[sessionNumber]?.total}</span> || <GrayedOutText>&ndash;</GrayedOutText>}
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

function CheckboxWithPrompt({ checked, onChange, title, disabled }) {
  const [showPrompt, setShowPrompt] = React.useState(false);
  return (
    <CheckboxWrapper title={title}>
      <Checkbox
        disabled={disabled}
        checked={checked}
        onChange={() => {
          if (checked) {
            setShowPrompt(true);
          } else {
            onChange?.();
          }
        }}
      />

      <AlertConfirmAction
        shouldConfirm={showPrompt}
        labelConfirm="Yakin"
        onConfirm={() => {
          setShowPrompt(false);
          onChange?.();
        }}
        labelCancel="Batal"
        onClose={() => setShowPrompt(false)}
      >
        Peserta akan tidak dihitung dalam pemeringkatan eliminasi.
        <br />
        Yakin?
      </AlertConfirmAction>
    </CheckboxWrapper>
  );
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

const CellExpander = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;

  white-space: nowrap;
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

  &:disabled {
    color: var(--ma-gray-200);
    box-shadow: none;
  }
`;

const WarningIconWrapper = styled.span`
  color: var(--ma-yellow);
`;

const CheckboxWrapper = styled.span`
  .rc-checkbox-disabled,
  .rc-checkbox-disabled .rc-checkbox-input {
    cursor: default;
  }

  .rc-checkbox-disabled.rc-checkbox-checked .rc-checkbox-inner,
  .rc-checkbox-disabled.rc-checkbox-checked:hover .rc-checkbox-inner {
    background-color: var(--ma-blue);
    border-color: var(--ma-blue);
  }

  .rc-checkbox-disabled.rc-checkbox-checked .rc-checkbox-inner:after {
    border-color: #ffffff;
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

export { ScoringTable };
