import * as React from "react";
import styled from "styled-components";

import { DisplayScore } from "./display-score";
import { DisplayScoreShootOff } from "./display-score-shoot-off";

import { sumScoresList, sumScoresAllRambahan } from "../utils";
import { defaultGrid } from "../constants";

function ScoreGridViewer({ scoringType = 1, gridData = defaultGrid }) {
  const shootoffIsEmpty = gridData.extraShot.every((shot) => !shot.score && !shot.distanceFromX);
  return (
    <ScoresTable className="table table-responsive">
      <thead>
        <tr>
          <th>Shot</th>
          {parseInt(scoringType) === 1 && (
            <React.Fragment>
              <THCenter>Sum</THCenter>
              <THCenter>Poin</THCenter>
            </React.Fragment>
          )}

          {parseInt(scoringType) === 2 && (
            <React.Fragment>
              <THCenter></THCenter>
              <THCenter>Sum</THCenter>
            </React.Fragment>
          )}
        </tr>
      </thead>

      <tbody>
        {gridData?.shot?.map((rambahan, rambahanIndex) => {
          return (
            <tr key={rambahanIndex}>
              <TDRambahan>
                <RambahanUhuy>
                  {rambahan.map((shot, shotIndex) => {
                    return (
                      <DisplayScore
                        key={shotIndex}
                        name={`score-${rambahanIndex}-${shotIndex}`}
                        value={shot}
                      />
                    );
                  })}
                </RambahanUhuy>
              </TDRambahan>

              {parseInt(scoringType) === 1 && (
                <React.Fragment>
                  <TDCenter>{sumScoresList(rambahan) || "-"}</TDCenter>
                  <TDCenter>
                    <ScoreCounter>{gridData.stats?.[rambahanIndex].point || "-"}</ScoreCounter>
                  </TDCenter>
                </React.Fragment>
              )}

              {parseInt(scoringType) === 2 && (
                <React.Fragment>
                  <TDCenter></TDCenter>
                  <TDCenter>
                    <ScoreCounter>{sumScoresList(rambahan) || "-"}</ScoreCounter>
                  </TDCenter>
                </React.Fragment>
              )}
            </tr>
          );
        })}

        <tr>
          <TDRambahan>
            <RambahanUhuy>
              {shootoffIsEmpty ? (
                <EmptyShootoff>Tidak ada shoot off</EmptyShootoff>
              ) : (
                gridData.extraShot.map((shot, index) => (
                  <DisplayScoreShootOff
                    key={index}
                    value={{
                      score: shot.score,
                      distance: shot.distanceFromX,
                    }}
                  />
                ))
              )}
            </RambahanUhuy>
          </TDRambahan>
          <td></td>

          <TDCenter>
            <span>S-Off</span>
          </TDCenter>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th></th>

          {parseInt(scoringType) === 1 && (
            <React.Fragment>
              <THTotal>{sumScoresAllRambahan(gridData?.shot)}</THTotal>
              <THTotal>
                <ScoreCounter>{gridData?.stats.result}</ScoreCounter>
              </THTotal>
            </React.Fragment>
          )}

          {parseInt(scoringType) === 2 && (
            <React.Fragment>
              <th></th>
              <THTotal>{sumScoresAllRambahan(gridData?.shot)}</THTotal>
            </React.Fragment>
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

const TDRambahan = styled.td`
  vertical-align: middle;
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
  vertical-align: middle;
  text-align: center;
`;

const THTotal = styled.th`
  font-size: 1.25em;
  text-align: center;
`;

const ScoreCounter = styled.span`
  display: inline-block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-gray-200);
  white-space: nowrap;
  text-align: center;
`;

const EmptyShootoff = styled.div`
  padding: 0.5rem;
  color: var(--ma-gray-400);
  text-align: center;
`;

export { ScoreGridViewer };
