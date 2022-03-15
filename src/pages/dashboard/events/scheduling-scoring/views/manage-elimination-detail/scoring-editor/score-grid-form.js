import * as React from "react";
import styled from "styled-components";

import { SelectScore } from "./select-score";
import { SelectExtraShot } from "./select-extra-shot";

import { sumScoresList, sumScoresAllRambahan } from "./utils";

function ScoreGridForm({ isEditMode, scoringType, gridData, updateShot, updateExtraShot }) {
  return (
    <ScoresTable className="table table-responsive">
      <thead>
        <tr>
          <THCenter>End</THCenter>
          <th>Shot</th>
          <THCenter>Sum</THCenter>
          {scoringType === parseInt(1) && <THCenter>Poin</THCenter>}
        </tr>
      </thead>

      <tbody>
        {gridData.shot.map((rambahan, rambahanIndex) => {
          return (
            <tr key={rambahanIndex}>
              <TDCenter>
                <span>{rambahanIndex + 1}</span>
              </TDCenter>

              <td>
                {isEditMode ? (
                  <RambahanUhuy>
                    {rambahan.map((shot, shotIndex) => (
                      <SelectScore
                        key={shotIndex}
                        score={shot}
                        onChange={(value) => {
                          updateShot?.({
                            rambahan: rambahanIndex,
                            shot: shotIndex,
                            value,
                          });
                        }}
                      />
                    ))}
                  </RambahanUhuy>
                ) : (
                  <RambahanUhuy>
                    {rambahan.map((score, index) => (
                      <DisplayScoreItem key={index}>{!score ? "-" : score}</DisplayScoreItem>
                    ))}
                  </RambahanUhuy>
                )}
              </td>

              <TDCenter>
                {(isEditMode ? sumScoresList(rambahan) : gridData.stats?.[rambahanIndex].total) ||
                  "-"}
              </TDCenter>
              {scoringType === parseInt(1) && (
                <TDCenter>{gridData.stats?.[rambahanIndex].point || "-"}</TDCenter>
              )}
            </tr>
          );
        })}

        <tr>
          <TDCenter>
            <span>S-Off</span>
          </TDCenter>

          <td>
            {isEditMode ? (
              <RambahanUhuy>
                {gridData.extraShot.map((shot, index) => (
                  <SelectExtraShot
                    key={index}
                    score={shot.score}
                    distanceFromX={shot.distanceFromX}
                    onChange={(value) => {
                      updateExtraShot?.({ shot: index, value: { score: value } });
                    }}
                    onDistanceChange={(value) => {
                      updateExtraShot?.({ shot: index, value: { distanceFromX: value } });
                    }}
                    onClearDistance={() => {
                      updateExtraShot?.({ shot: index, value: { distanceFromX: "" } });
                    }}
                  />
                ))}
              </RambahanUhuy>
            ) : (
              <RambahanUhuy>
                {gridData.extraShot.map((shot, index) => (
                  <DisplayScoreItem key={index}>{!shot.score ? "-" : shot.score}</DisplayScoreItem>
                ))}
              </RambahanUhuy>
            )}
          </td>
          <td colSpan="3">&nbsp;</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <THRight colSpan="2">Total:</THRight>
          <THTotal>
            {isEditMode ? sumScoresAllRambahan(gridData.shot) : gridData.stats.total}
          </THTotal>
          {scoringType === parseInt(1) && (
            <THTotal>{isEditMode ? "..." : gridData.stats.result || "-"}</THTotal>
          )}
        </tr>
      </tfoot>
    </ScoresTable>
  );
}

const ScoresTable = styled.table`
  tbody > tr {
    cursor: default;
  }

  &.table-focused {
    border-radius: 0.25rem;
    box-shadow: 0 0 0 2px var(--ma-field-focused);
  }
`;

const DisplayScoreItem = styled.div`
  min-width: 2rem;
  padding: 0.25rem 0.5rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.25rem;
  background-color: var(--ma-gray-50);
  text-transform: uppercase;
  text-align: center;
`;

const RambahanUhuy = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const THCenter = styled.th`
  text-align: center;
`;

const TDCenter = styled.td`
  text-align: center;
`;

const THRight = styled.th`
  text-align: right;
`;

const THTotal = styled.th`
  font-size: 1.25em;
  text-align: center;
`;

export { ScoreGridForm };
