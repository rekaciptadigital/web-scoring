import { parseServerDatetime } from "../utils/datetime";

function makeStateFees(eventCategories) {
  const feesByTeamFromServer = computeFeesByTeam(eventCategories);

  const feeAmountsList = feesByTeamFromServer
    .map((teamFee) => Number(teamFee.fee))
    .filter((fee) => Boolean(fee));
  const feesDeduped = [...new Set(feeAmountsList)];
  const isFree = feesDeduped?.length === 0;
  const isFlatFee = feesDeduped?.length === 1 || isFree; // 0 itu event free, gak ada harga daftar

  const earlyBirdsList = feesByTeamFromServer.map((teamFee) => Number(teamFee.earlyBird));
  const earlyBirdsDeduped = [...new Set(earlyBirdsList)];

  let isEarlyBird;
  let earlyBirdEndDate;
  let earlyBirdFee = isFree ? 0 : undefined;

  for (const teamFee of feesByTeamFromServer) {
    if (teamFee.endDateEarlyBird) {
      earlyBirdEndDate = teamFee.endDateEarlyBird;
    }
    if (teamFee.isEarlyBird) {
      isEarlyBird = true;
      if (isFlatFee) {
        earlyBirdFee = Number(teamFee.earlyBird);
      }
    }
  }

  const uiState = {
    registrationFee: feeAmountsList.sort((a, b) => b - a)[0], // ambil harga tertinggi
    isEarlyBird: isEarlyBird,
    earlyBirdEndDate: earlyBirdEndDate,
    earlyBirdFee: isFlatFee ? earlyBirdFee : earlyBirdsDeduped.sort((a, b) => b - a)[0], // ambil harga tertinggi
    isFlatFee: isFlatFee,
    feesByTeam: makeFeesByTeam(feesByTeamFromServer, {
      isFlatFee,
      flatFeeAmount: feesDeduped[0] || 0,
    }),
    earlyBirdByTeam: makeEarlyBirdFeesByTeam(feesByTeamFromServer),
  };

  return uiState;
}

function makeFeesByTeam(feesFromServer, { isFlatFee, flatFeeAmount }) {
  return feesFromServer.map((feeItem) => ({
    team: feeItem.teamCategory,
    amount: isFlatFee ? flatFeeAmount : feeItem.fee,
    isActive: feeItem.isActive,
  }));
}

function makeEarlyBirdFeesByTeam(feesFromServer) {
  return feesFromServer.map((feeItem) => ({
    team: feeItem.teamCategory,
    amount: feeItem.isEarlyBird ? feeItem.earlyBird : 0,
    isActive: feeItem.isEarlyBird && feeItem.earlyBird,
  }));
}

function computeFeesByTeam(eventCategories) {
  const feeIndividu = eventCategories.find((category) => {
    return (
      category.teamCategoryId.id === "individu male" ||
      category.teamCategoryId.id === "individu female"
    );
  });

  const feeIndividuMix = eventCategories.find((category) => {
    return category.teamCategoryId.id === "individu_mix";
  });

  const feeTeam = eventCategories.find((category) => {
    return (
      category.teamCategoryId.id === "male_team" || category.teamCategoryId.id === "female_team"
    );
  });

  const feeMix = eventCategories.find((category) => {
    return category.teamCategoryId.id === "mix_team";
  });

  return [
    {
      isActive: feeIndividu ? Boolean(feeIndividu.isShow) : false,
      teamCategory: "individu",
      fee: feeIndividu?.fee ? Number(feeIndividu?.fee) : "",
      isEarlyBird: Boolean(feeIndividu?.isEarlyBird),
      endDateEarlyBird: feeIndividu?.isEarlyBird
        ? parseServerDatetime(feeIndividu?.endDateEarlyBird)
        : undefined,
      earlyBird: feeIndividu?.earlyBird ? Number(feeIndividu?.earlyBird) : "",
    },
    {
      isActive: feeIndividuMix ? Boolean(feeIndividuMix.isShow) : false,
      teamCategory: "individu_mix",
      fee: feeIndividuMix?.fee ? Number(feeIndividuMix?.fee) : "",
      isEarlyBird: Boolean(feeIndividuMix?.isEarlyBird),
      endDateEarlyBird: feeIndividuMix?.isEarlyBird
        ? parseServerDatetime(feeIndividuMix?.endDateEarlyBird)
        : undefined,
      earlyBird: feeIndividuMix?.earlyBird ? Number(feeIndividuMix?.earlyBird) : "",
    },
    {
      isActive: feeTeam ? Boolean(feeTeam.isShow) : false,
      teamCategory: "team",
      fee: feeTeam?.fee ? Number(feeTeam.fee) : "",
      isEarlyBird: Boolean(feeTeam?.isEarlyBird),
      endDateEarlyBird: feeTeam?.isEarlyBird
        ? parseServerDatetime(feeTeam?.endDateEarlyBird)
        : undefined,
      earlyBird: feeTeam?.earlyBird ? Number(feeTeam?.earlyBird) : "",
    },
    {
      isActive: feeMix ? Boolean(feeMix.isShow) : false,
      teamCategory: "mix",
      fee: feeMix?.fee ? Number(feeMix.fee) : "",
      isEarlyBird: Boolean(feeMix?.isEarlyBird),
      endDateEarlyBird: feeMix?.isEarlyBird
        ? parseServerDatetime(feeMix.endDateEarlyBird)
        : undefined,
      earlyBird: feeMix?.earlyBird ? Number(feeMix.earlyBird) : "",
    },
  ];
}

export { makeStateFees };
