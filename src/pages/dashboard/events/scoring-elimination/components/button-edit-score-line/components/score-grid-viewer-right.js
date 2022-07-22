import * as React from "react";
import styled from "styled-components";

import { DisplayScore } from "./display-score";
import { DisplayScoreShootOff } from "./display-score-shoot-off";

import { sumScoresList, sumScoresAllRambahan } from "../utils";
import { defaultGrid } from "../constants";

function ScoreGridViewerRight({ scoringType = 1, gridData = defaultGrid }) {
  const shootoffIsEmpty = gridData.extraShot.every((shot) => !shot.score && !shot.distanceFromX);
  return (
    <ScoresTable className="table table-responsive">
      <thead>
        <tr>
          {parseInt(scoringType) === 1 && (
            <React.Fragment>
              <THCenter>Poin</THCenter>
              <THCenter>Sum</THCenter>
            </React.Fragment>
          )}

          {parseInt(scoringType) === 2 && (
            <React.Fragment>
              <THCenter>Sum</THCenter>
              <THCenter></THCenter>
            </React.Fragment>
          )}

          <THRight>Shot</THRight>
        </tr>
      </thead>

      <tbody>
        {gridData.shot.map((rambahan, rambahanIndex) => {
          return (
            <tr key={rambahanIndex}>
              {parseInt(scoringType) === 1 && (
                <React.Fragment>
                  <TDCenter>
                    <ScoreCounter>{gridData.stats?.[rambahanIndex].point || "-"}</ScoreCounter>
                  </TDCenter>
                  <TDCenter>{sumScoresList(rambahan) || "-"}</TDCenter>
                </React.Fragment>
              )}

              {parseInt(scoringType) === 2 && (
                <React.Fragment>
                  <TDCenter>
                    <ScoreCounter>{sumScoresList(rambahan) || "-"}</ScoreCounter>
                  </TDCenter>
                  <TDCenter></TDCenter>
                </React.Fragment>
              )}

              <TDRambahan>
                <RambahanUhuy>
                  {rambahan.map((shot, shotIndex) => (
                    <DisplayScore
                      key={shotIndex}
                      name={`score-${rambahanIndex}-${shotIndex}`}
                      value={shot}
                    />
                  ))}
                </RambahanUhuy>
              </TDRambahan>
            </tr>
          );
        })}

        <tr>
          <TDCenter>
            <span>S-Off</span>
          </TDCenter>
          <td>&nbsp;</td>

          <TDRambahan>
            <RambahanUhuy>
              {shootoffIsEmpty ? (
                <EmptyShootoff>Tidak ada shoot off</EmptyShootoff>
              ) : (
                gridData.extraShot.map((shot, index) => (
                  <DisplayScoreShootOff
                    key={index}
                    value={{ score: shot.score, distance: shot.distanceFromX }}
                  />
                ))
              )}
            </RambahanUhuy>
          </TDRambahan>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          {parseInt(scoringType) === 1 && (
            <React.Fragment>
              <THTotal>
                <ScoreCounter>{gridData?.stats.result}</ScoreCounter>
              </THTotal>
              <THTotal>{sumScoresAllRambahan(gridData?.shot)}</THTotal>
            </React.Fragment>
          )}

          {parseInt(scoringType) === 2 && (
            <React.Fragment>
              <THTotal>{sumScoresAllRambahan(gridData?.shot)}</THTotal>
              <th></th>
            </React.Fragment>
          )}

          <th></th>
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
  justify-content: flex-end;
  width: 100%;
`;

const THCenter = styled.th`
  text-align: center;
`;

const TDCenter = styled.td`
  vertical-align: middle;
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

export { ScoreGridViewerRight };
