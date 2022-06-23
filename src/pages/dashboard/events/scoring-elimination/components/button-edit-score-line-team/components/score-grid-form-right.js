import * as React from "react";
import styled from "styled-components";
import { useInputSwitcher } from "../../../contexts/input-switcher";

import { SelectScore } from "./select-score-compact";
import { SelectScoreShootOff } from "./select-score-shoot-off";

import { sumScoresList, sumScoresAllRambahan, getValueFromInput } from "../utils";
import { defaultGrid } from "../constants";

function ScoreGridFormRight({ scoringType = 1, gridData = defaultGrid, onChange }) {
  const { shouldFocusInput, move: _move, setPosition: _setPosition } = useInputSwitcher();
  const SIDE = 1;
  const move = (pos) => _move(SIDE, pos);
  const setPosition = (pos) => _setPosition(SIDE, pos);

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
    const updatedValue = { ...gridData, shot: updatedShot };
    onChange?.(updatedValue);
  };

  const handleChangeShootoff = ({ index: shootoffIndex, value }) => {
    const updatedExtraShot = gridData.extraShot.map((shot, index) => {
      if (index !== shootoffIndex) {
        return shot;
      }
      return { score: value.score, distanceFromX: value.distance };
    });
    const updatedValue = { ...gridData, extraShot: updatedExtraShot };
    onChange?.(updatedValue);
  };

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
                  {rambahan.map((shot, shotIndex) => {
                    const pos = { y: rambahanIndex, x: shotIndex };
                    const isFocus = shouldFocusInput(SIDE, pos);
                    return (
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
                          move(pos);
                        }}
                        onInputChange={(inputString) => {
                          const value = getValueFromInput(inputString);
                          if (!value) {
                            return;
                          }
                          handleChangeScores({
                            rambahan: rambahanIndex,
                            shot: shotIndex,
                            value: value,
                          });
                          move(pos);
                        }}
                        isFocus={isFocus}
                        onFocus={() => setPosition(pos)}
                      />
                    );
                  })}
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

export { ScoreGridFormRight };
