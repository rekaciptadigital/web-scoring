import * as React from "react";
import styled from "styled-components";

import { SelectScore } from "./select-score-compact";
import { SelectScoreShootOff } from "./select-score-shoot-off";

import { sumScoresList, sumScoresAllRambahan } from "../utils";

function ScoreGridForm({
  scoringType = 1,
  gridData = {
    shot: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    stats: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    extraShot: [
      { score: "", distanceFromX: 0 },
      { score: "", distanceFromX: 0 },
      { score: "", distanceFromX: 0 },
    ],
  },
}) {
  return (
    <ScoresTable className="table table-responsive">
      <thead>
        <tr>
          {/* <THCenter>End</THCenter> */}
          <th>Shot</th>
          <THCenter>Sum</THCenter>
          {scoringType === parseInt(1) && <THCenter>Poin</THCenter>}
        </tr>
      </thead>

      <tbody>
        {gridData.shot.map((rambahan, rambahanIndex) => {
          return (
            <tr key={rambahanIndex}>
              {/* <TDCenter>
                <span>{rambahanIndex + 1}</span>
              </TDCenter> */}

              <td>
                <RambahanUhuy>
                  {rambahan.map((shot, shotIndex) => (
                    <SelectScore
                      key={shotIndex}
                      name={`score-${rambahanIndex}-${shotIndex}`}
                      value={shot}
                      // onChange={}
                    />
                  ))}
                </RambahanUhuy>
              </td>

              <TDCenter>{sumScoresList(rambahan) || "-"}</TDCenter>
              {scoringType === parseInt(1) && (
                <TDCenter>
                  <ScoreCounter>{gridData.stats?.[rambahanIndex].point || "-"}</ScoreCounter>
                </TDCenter>
              )}
            </tr>
          );
        })}

        <tr>
          <td>
            <RambahanUhuy>
              {gridData.extraShot.map((shot, index) => (
                <SelectScoreShootOff
                  key={index}
                  value={{
                    score: shot.score,
                    distance: shot.distanceFromX,
                  }}
                  // onChange
                  // onSetDistance
                />
              ))}
            </RambahanUhuy>
          </td>
          <td>&nbsp;</td>

          <TDCenter>
            <span>S-Off</span>
          </TDCenter>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <THRight></THRight>
          <THTotal>{sumScoresAllRambahan(gridData.shot)}</THTotal>
          {scoringType === parseInt(1) && (
            <THTotal>
              <ScoreCounter>{"..."}</ScoreCounter>
            </THTotal>
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

const ScoreCounter = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-gray-200);
  white-space: nowrap;
  text-align: center;
`;

export { ScoreGridForm };
