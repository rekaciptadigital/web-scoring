import * as React from "react";
import styled from "styled-components";

import { SelectScore } from "./select-score-compact";
import { SelectScoreShootOff } from "./select-score-shoot-off";

import { sumScoresList, sumScoresAllRambahan } from "../utils";

const defaultGrid = {
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
};

function ScoreGridForm({ scoringType = 1, gridData = defaultGrid, onChange }) {
  const handleChangeScores = ({ rambahan: rambahanIndex, shot: shotIndex, value }) => {
    const updatedShot = gridData.shot.map((rambahan, index) => {
      if (index !== rambahanIndex) {
        return rambahan;
      }

      return rambahan.map((shot, index) => {
        if (index !== shotIndex) {
          return shot;
        }
        return value;
      });
    });

    onChange?.({
      ...gridData,
      shot: updatedShot,
    });
  };

  const handleChangeShootoff = ({ index: shootoffIndex, value }) => {
    const updatedExtraShot = gridData.extraShot.map((shot, index) => {
      if (index !== shootoffIndex) {
        return shot;
      }

      return { score: value.score, distanceFromX: value.distance };
    });

    onChange?.({
      ...gridData,
      extraShot: updatedExtraShot,
    });
  };

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
                  {rambahan.map((shot, shotIndex) => (
                    <SelectScore
                      key={shotIndex}
                      name={`score-${rambahanIndex}-${shotIndex}`}
                      value={shot}
                      onChange={(value) => {
                        handleChangeScores({
                          rambahan: rambahanIndex,
                          shot: shotIndex,
                          value,
                        });
                      }}
                    />
                  ))}
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
              {gridData.extraShot.map((shot, index) => (
                <SelectScoreShootOff
                  key={index}
                  value={{
                    score: shot.score,
                    distance: shot.distanceFromX,
                  }}
                  onChange={(value) => handleChangeShootoff({ index, value })}
                />
              ))}
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
                <ScoreCounter>{"..."}</ScoreCounter>
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

export { ScoreGridForm };
