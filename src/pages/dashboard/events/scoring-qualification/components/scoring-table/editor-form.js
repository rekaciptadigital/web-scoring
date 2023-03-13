import * as React from "react";
import styled from "styled-components";
import { useInputSwitcher } from "./hooks/input-switcher";

import { SpinnerDotBlock } from "components/ma";
import { SelectScore } from "./select-score";
import { DisplayScore } from "../display-score";

import classnames from "classnames";

/**
 * Controlled component
 * ...gak manage state di dalam kecuali untuk kebutuhan internal
 * (tapi gak di-ekspose langsung ke parent - lihat pemanggilan onChange?.(...))
 */
function EditorForm({ viewMode, scoresData, isLoading, onChange }) {
  const scoresFromProp = _makeScoresDataFromProp(scoresData);
  const rambahanNumbers = scoresFromProp ? Object.keys(scoresFromProp) : [];
  const shotsCount = scoresFromProp[rambahanNumbers[0]]?.length || 0;
  const [selectedScore, setSelectedScore] = React.useState(null);
  const [moveTrigger, setMoveTrigger] = React.useState(false);
  const { shouldFocusSelector, move, setPosition } =
    useInputSwitcher(scoresData);

  React.useEffect(() => {
    if (!selectedScore) {
      return;
    }
    onChange?.(_makeOutputValue(scoresFromProp, selectedScore));
  }, [selectedScore]);

  React.useEffect(() => {
    if (moveTrigger) {
      setMoveTrigger(false);
      move({
        y: selectedScore.rambahan,
        x: selectedScore.shot,
        scoresFromProp,
      });
    }
  }, [moveTrigger, selectedScore, scoresFromProp]);

  const handleSelectScore = (selectData) => {
    setSelectedScore(selectData);
    setMoveTrigger(true);
    // move({ y: selectData.rambahan, x: selectData.shot, scoresFromProp });
  };

  return (
    <SessionContainer>
      <SessionBody>
        <LoadingBlocker isLoading={isLoading} />
        <ScoresTable className="table table-responsive">
          <thead>
            <tr>
              <th className="text-center">End</th>
              <th colSpan={shotsCount}>Shot</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>

          <tbody>
            {rambahanNumbers.map((rambahanNumber, rambahanIndex) => (
              <tr key={rambahanNumber}>
                <RambahanCell className={classnames({ "font-bold": viewMode })}>
                  {rambahanNumber}
                </RambahanCell>

                {scoresFromProp[rambahanNumber].map((scoreItem, shotIndex) => {
                  const pos = { y: rambahanIndex, x: shotIndex };
                  const isFocus = shouldFocusSelector(pos);
                  return (
                    <RambahanCell key={shotIndex}>
                      {viewMode ? (
                        <DisplayScore value={scoreItem} />
                      ) : (
                        <SelectScore
                          name={`shot-score-${rambahanIndex}-${shotIndex}`}
                          value={scoreItem}
                          onChange={(value) => {
                            if (value === "-") value = "";
                            handleSelectScore({
                              rambahan: rambahanIndex,
                              shot: shotIndex,
                              score: value,
                            });
                          }}
                          onInputChange={(inputString) => {
                            const value = _getValueFromInput(inputString);
                            if (!value) {
                              return;
                            }
                            handleSelectScore({
                              rambahan: rambahanIndex,
                              shot: shotIndex,
                              score: value,
                            });
                          }}
                          isFocus={isFocus}
                          onFocus={() => setPosition(pos)}
                        />
                      )}
                    </RambahanCell>
                  );
                })}

                <RambahanCell className={classnames({ "font-bold": viewMode })}>
                  {_sumRambahanTotal(scoresFromProp[rambahanNumber])}
                </RambahanCell>
              </tr>
            ))}
          </tbody>
        </ScoresTable>
      </SessionBody>

      <SessionStatsFooter>
        <StatCount label="X+10:" isLoading={isLoading}>
          {_countXPlusTen(scoresFromProp)}
        </StatCount>

        <StatCount label="X:" isLoading={isLoading}>
          {_countX(scoresFromProp)}
        </StatCount>

        <StatTotal isLoading={isLoading}>{_sumTotal(scoresFromProp)}</StatTotal>
      </SessionStatsFooter>
    </SessionContainer>
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

function StatCount({ children, amount, label = "X", isLoading }) {
  if (isLoading) {
    return (
      <StatItem>
        <span>{label}</span>
        <SkeletonStatItem>{children || amount || "00"}</SkeletonStatItem>
      </StatItem>
    );
  }
  return (
    <StatItem>
      <span>{label}</span>
      <span>{children || amount || 0}</span>
    </StatItem>
  );
}

function StatTotal({ children, amount, isLoading }) {
  if (isLoading) {
    return (
      <StatItem>
        <span>Total:</span>
        <SkeletonStatItem className="total">
          {children || amount || "00"}
        </SkeletonStatItem>
      </StatItem>
    );
  }
  return (
    <StatItem>
      <span>Total:</span>
      <TotalNumber>{children || amount || 0}</TotalNumber>
    </StatItem>
  );
}

/* ============================== */
// styles

const SessionContainer = styled.div`
  > * + * {
    margin-top: 0.5rem;
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

const SkeletonStatItem = styled.span`
  border-radius: 0.25rem;
  color: transparent;
  background-color: var(--ma-gray-100);

  &.total {
    font-size: 1.125rem;
  }
`;

const SessionBody = styled.div`
  position: relative;
  min-width: 30rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const SessionStatsFooter = styled.div`
  padding: 0.75rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 3rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
`;

const TotalNumber = styled.span`
  font-size: 1.125rem;
`;

const ScoresTable = styled.table`
  margin: 0;

  th {
    color: var(--ma-txt-black);
    font-weight: 600;
  }
`;

const RambahanCell = styled.td`
  ${ScoresTable} & {
    padding: 0.5rem 0.25rem;
    text-align: center;
    vertical-align: middle;

    &.font-bold {
      font-weight: 600;
    }
  }
`;

/* ============================ */
// utils

function _makeScoresDataFromProp(scoresData) {
  return (
    scoresData || {
      1: ["", "", "", "", "", ""],
      2: ["", "", "", "", "", ""],
      3: ["", "", "", "", "", ""],
      4: ["", "", "", "", "", ""],
      5: ["", "", "", "", "", ""],
      6: ["", "", "", "", "", ""],
    }
  );
}

function _makeOutputValue(previousData, selectData) {
  const rambahanNumber = selectData.rambahan + 1;
  const updatedRambahanScores = previousData[rambahanNumber].map(
    (existingScore, index) => {
      if (index !== selectData.shot) {
        return existingScore;
      }
      return selectData.score;
    }
  );

  return { ...previousData, [rambahanNumber]: updatedRambahanScores };
}

function _convertScoreValueType(inputValue) {
  if (!inputValue || inputValue === "-") {
    return "-";
  }
  if (["m", "x"].indexOf(inputValue.toLowerCase?.()) >= 0) {
    return inputValue;
  }
  return Number(inputValue);
}

function _sumRambahanTotal(list) {
  const _sumReducer = (total, inputValue) => {
    const value = _convertScoreValueType(inputValue);
    if (!inputValue || value === "m" || value === "-") {
      return total;
    }
    if (value === "x") {
      return total + 10;
    }
    return total + value;
  };
  return list.reduce(_sumReducer, 0);
}

function _sumTotal(gridData) {
  if (!gridData) {
    return 0;
  }
  const total = Object.keys(gridData).reduce((total, id) => {
    return total + _sumRambahanTotal(gridData[id]);
  }, 0);

  return total;
}

function _countX(gridData) {
  if (!gridData) {
    return 0;
  }

  const counts = Object.keys(gridData).reduce((total, id) => {
    let tempTotal = total;
    gridData[id].forEach((scoreValue) => {
      if (_convertScoreValueType(scoreValue) !== "x") {
        return;
      }
      tempTotal = tempTotal + 1;
    });
    return tempTotal;
  }, 0);

  return counts;
}

function _countXPlusTen(gridData) {
  if (!gridData) {
    return 0;
  }

  const counts = Object.keys(gridData).reduce((total, id) => {
    let tempTotal = total;
    gridData[id].forEach((scoreValue) => {
      const score = _convertScoreValueType(scoreValue);
      if (score !== "x" && score !== 10) {
        return;
      }
      tempTotal = tempTotal + 1;
    });
    return tempTotal;
  }, 0);

  return counts;
}

function _getValueFromInput(inputString) {
  const numberValue = Number(inputString);
  const checkValue = !isNaN(numberValue) ? numberValue : inputString;
  const value =
    ["m", "x", 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(checkValue) > -1
      ? checkValue
      : false;
  return value;
}

export { EditorForm };
