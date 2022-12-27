import * as React from "react";
import styled from "styled-components";

import { SpinnerDotBlock } from "components/ma";
import { SelectScoreShootOff } from "./select-score-shoot-off";
import { DisplayScore } from "../display-score";

/**
 * Controlled component
 * ...gak manage state di dalam kecuali untuk kebutuhan internal
 * (tapi gak di-ekspose langsung ke parent - lihat pemanggilan onChange?.(data))
 */
function EditorFormShootOff({ viewMode, shootOffData, isLoading, onChange }) {
  const scoresFromProp = _makeScoresDataFromProp(shootOffData);

  const [selectedScore, setSelectedScore] = React.useState(null);
  const [nextFocusedSelector, setNextFocusedSelector] = React.useState(0);

  React.useEffect(() => {
    if (!selectedScore) {
      return;
    }
    onChange?.(_makeOutputValue(scoresFromProp, selectedScore));
  }, [selectedScore]);

  const shouldFocusSelector = (shotIndex) => {
    const initiatingData = Boolean(shootOffData) && isLoading;
    const noData = !isLoading && !shootOffData;
    if (initiatingData) {
      return false;
    }
    if (noData) {
      // default ke select skor pertama
      return shotIndex === 0;
    }
    return shotIndex === nextFocusedSelector;
  };

  const handleSelectScore = (selectData) => {
    setSelectedScore(selectData);

    const isValueForDistance = ["m"].indexOf(selectData.score) < 0;
    if (!isValueForDistance) {
      setNextFocusedSelector(selectData.shotIndex + 1);
    }
  };

  return (
    <SessionContainer>
      <SessionBody>
        <LoadingBlocker isLoading={isLoading} />

        <ShootOffFormContainer>
          <ShootOffBar>
            <ShootOffGroup>
              {scoresFromProp.map((scoreValue, index) =>
                viewMode ? (
                  <DisplayScore key={scoreValue} value={scoreValue} />
                ) : (
                  <SelectScoreShootOff
                    key={index}
                    name={`shot-off-score-${index + 1}`}
                    value={scoreValue}
                    onChange={(value) => {
                      handleSelectScore({
                        shotIndex: index,
                        score: value.score,
                        distanceFromX: value.distance,
                      });
                    }}
                    isFocus={shouldFocusSelector(index)}
                    onFocus={() => setNextFocusedSelector(index)}
                    onBlur={() => setNextFocusedSelector(null)}
                    onSetDistance={() => {
                      const isLastIndex = index >= scoresFromProp.length - 1;
                      setNextFocusedSelector(isLastIndex ? index : index + 1);
                    }}
                  />
                )
              )}
            </ShootOffGroup>

            <StatTotal>{_sumTotalShootOffScores(scoresFromProp)}</StatTotal>
          </ShootOffBar>
        </ShootOffFormContainer>
      </SessionBody>
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

function StatTotal({ children, amount, isLoading }) {
  if (isLoading) {
    return <SkeletonStatItem className="total">{children || amount || "00"}</SkeletonStatItem>;
  }
  return <TotalNumber>{children || amount || 0}</TotalNumber>;
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

const TotalNumber = styled.span`
  font-size: 1.125rem;
`;

const ShootOffFormContainer = styled.div`
  position: relative;
  min-width: 30rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ShootOffBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
`;

const ShootOffGroup = styled.div`
  max-width: 22.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

/* ============================ */
// utils

function _makeScoresDataFromProp(scoresData) {
  if (!scoresData?.length) {
    return [
      { score: "", distanceFromX: "" },
      { score: "", distanceFromX: "" },
      { score: "", distanceFromX: "" },
      { score: "", distanceFromX: "" },
      { score: "", distanceFromX: "" },
    ];
  }
  return scoresData;
}

function _makeOutputValue(previousData, selectData) {
  const updatedRambahanScores = previousData.map((existingScore, index) => {
    if (index !== selectData.shotIndex) {
      return existingScore;
    }
    return { score: selectData.score, distanceFromX: selectData.distanceFromX };
  });

  return updatedRambahanScores;
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

function _sumTotalShootOffScores(shootOffScoresList) {
  if (!shootOffScoresList?.length) {
    return 0;
  }

  const _sumReducer = (total, inputValue) => {
    const value = _convertScoreValueType(inputValue.score);
    if (!inputValue.score || value === "m" || value === "-") {
      return total;
    }
    if (value === "x") {
      return total + 10;
    }
    return total + value;
  };

  return shootOffScoresList.reduce(_sumReducer, 0);
}

export { EditorFormShootOff };
