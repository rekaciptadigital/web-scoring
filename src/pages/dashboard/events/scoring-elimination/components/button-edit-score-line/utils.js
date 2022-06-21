function sumScoresList(list) {
  if (!list) {
    return 0;
  }
  const sumReducer = (total, value) => {
    if (!value || (typeof value === "string" && value.toLowerCase() === "m")) {
      return total;
    }
    if (typeof value === "string" && value.toLowerCase() === "x") {
      return total + 10;
    }
    return total + value;
  };
  return list.reduce(sumReducer, 0);
}

function makeScoringPayload({ data, state }) {
  const members = state.map((member, index) => ({
    member_id: member.participant.member.id,
    scores: {
      shot: data[index].shot.map((rambahan) => ({ score: rambahan })),
      extraShot: data[index].extraShot,
      win: member.scores.win,
    },
  }));
  //coba tanpa type?
  return { type: 2, members };
}

function sumScoresAllRambahan(shotData) {
  if (!shotData) {
    return 0;
  }
  const total = shotData.reduce((total, rambahanShots) => {
    return total + sumScoresList(rambahanShots);
  }, 0);

  return total;
}

function hasWinner(scoringData) {
  if (!scoringData) {
    return false;
  }
  const hasAttributeWinToBeTrue = (member) => Boolean(member.scores.win);
  return scoringData.some(hasAttributeWinToBeTrue);
}

function _getValueFromInput(inputString) {
  const numberValue = Number(inputString);
  const checkValue = !isNaN(numberValue) ? numberValue : inputString;
  const value =
    ["m", "x", 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(checkValue) > -1 ? checkValue : false;
  return value;
}

export { sumScoresList, sumScoresAllRambahan, makeScoringPayload, hasWinner, _getValueFromInput };
