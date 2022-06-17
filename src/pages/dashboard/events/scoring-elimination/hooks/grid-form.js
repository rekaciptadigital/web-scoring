import * as React from "react";

function makeDefaultData() {
  return {
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
}

function useGridForm(playerDetail) {
  const [value, setValue] = React.useState(() => makeDefaultData());

  React.useEffect(() => {
    if (!playerDetail) {
      return;
    }
    setValue(transformGridData(playerDetail));
  }, [playerDetail]);

  return { value, setValue };
}

// utils
const handleScoreType = (score) => {
  const checkValue = isNaN(score) || !score ? score : Number(score);
  if (typeof checkValue === "undefined") {
    return "";
  }
  return checkValue;
};

function transformGridData(playerDetail) {
  const transformedShot = playerDetail.shot.map((rambahan) => {
    return rambahan.score.map((item) => handleScoreType(item));
  });

  const stats = { total: playerDetail.total, result: playerDetail.result };
  playerDetail.shot.forEach((shot, index) => {
    stats[index] = { total: shot.total, point: shot.point };
  });

  const checkExtraShotLength = (shots) => (shots.length > 3 ? shots.slice(2) : shots);

  return {
    shot: transformedShot,
    stats: stats,
    extraShot: checkExtraShotLength(playerDetail.extraShot).map((shot) => ({
      score: handleScoreType(shot.score),
      distanceFromX: handleScoreType(shot.distanceFromX),
    })),
  };
}

export { useGridForm };
