import * as React from "react";
import styled from "styled-components";

import { SpinnerDotBlock } from "components/ma";
import { SelectScore } from "./select-score";

/**
 * Controlled component
 * ...gak manage state di dalam kecuali untuk kebutuhan internal
 * (tapi gak di-ekspose langsung ke parent - lihat pemanggilan onChange?.(...))
 */
function EditorForm({ scoresData, isLoading, onChange }) {
  const scoresFromProp = _makeScoresDataFromProp(scoresData);

  const [selectedScore, setSelectedScore] = React.useState(null);

  React.useEffect(() => {
    if (!selectedScore) {
      return;
    }
    onChange?.(_makeOutputValue(scoresFromProp, selectedScore));
  }, [selectedScore]);

  const handleSelectScore = (selectData) => {
    setSelectedScore(selectData);
  };

  return (
    <SessionContainer>
      <SessionBody>
        <LoadingBlocker isLoading={isLoading} />
        <ScoresTable className="table table-responsive">
          <thead>
            <tr>
              <th>End</th>
              <th colSpan="6">Shot</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5, 6].map((rambahanNumber, rambahanIndex) => (
              <tr key={rambahanNumber}>
                <td>{rambahanNumber}</td>

                {scoresFromProp[rambahanNumber].map((scoreItem, shotIndex) => (
                  <td key={shotIndex}>
                    <SelectScore
                      name={`shot-score-${rambahanIndex}-${shotIndex}`}
                      value={scoreItem}
                      onChange={(value) => {
                        handleSelectScore({
                          rambahan: rambahanIndex,
                          shot: shotIndex,
                          score: value,
                        });
                      }}
                    />
                  </td>
                ))}

                <td>{_sumRambahanTotal(scoresFromProp[rambahanNumber])}</td>
              </tr>
            ))}
          </tbody>
        </ScoresTable>

        <ShotOffBar>
          <ShotOffGroup>
            <div>S-Off</div>
            <ShotOffGroup>
              {[1, 2, 3].map((number) => (
                <SelectScore
                  key={number}
                  name={`shot-off-score-${number}`}
                  value=""
                  // onChange={handleSelectScore}
                />
              ))}
            </ShotOffGroup>
          </ShotOffGroup>

          {/* TODO: nilai dari data */}
          <div>{0}</div>
        </ShotOffBar>
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
        <SkeletonStatItem className="total">{children || amount || "00"}</SkeletonStatItem>
      </StatItem>
    );
  }
  return (
    <StatItem>
      <span>Total:</span>
      <TotalNumber>{children || amount}</TotalNumber>
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

  td {
    text-align: center;
    vertical-align: middle;
  }
`;

const ShotOffBar = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5rem;
`;

const ShotOffGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
  const updatedRambahanScores = previousData[rambahanNumber].map((existingScore, index) => {
    if (index !== selectData.shot) {
      return existingScore;
    }
    return selectData.score;
  });

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
    if (!inputValue || value === "m") {
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

export { EditorForm };
