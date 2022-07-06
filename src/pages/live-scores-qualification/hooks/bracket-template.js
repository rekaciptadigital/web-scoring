import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EliminationService } from "services";
import { useDisplaySettings } from "../contexts/display-settings";

const POLLING_INTERVAL = 10000;

function useBracketTemplate({ categoryId, shouldPoll }) {
  const { event_id } = useParams();
  const fetcher = useFetcher();
  const { setLastUpdated, setRound, setRoundOptions } = useDisplaySettings();

  const isLoading = !fetcher.data && fetcher.isLoading;
  const isFetching = fetcher.data && fetcher.isLoading;

  React.useEffect(() => {
    if (!categoryId) {
      return;
    }
    const fetchData = () => {
      const getFunction = () => {
        return EliminationService.getEventEliminationTemplate({
          event_id: event_id,
          match_type: 1, // tipe "A-Z", hard coded untuk sekarang
          event_category_id: categoryId,
          // elimination_member_count: countNumber, (?)
        });
      };
      fetcher.runAsync(getFunction, {
        onSuccess: (data) => {
          setLastUpdated(() => new Date());
          setRoundOptions(_getTabLabels(data?.rounds));
          const round = _computeActiveRound(data);
          setRound(round);
        },
      });
    };
    fetchData();

    if (!shouldPoll) {
      return;
    }

    const matchesPollingTimer = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(matchesPollingTimer);
  }, [categoryId, shouldPoll]);

  return { ...fetcher, isLoading, isFetching };
}

function _getTabLabels(bracketTemplate) {
  if (!bracketTemplate) {
    return [];
  }

  const tabLabels = {
    16: "32 Besar",
    8: "16 Besar",
    4: "8 Besar",
    2: "Semi-Final",
  };
  let finalHasTaken = false;
  const labels = bracketTemplate.map((round) => {
    const matchCount = round.seeds.length;
    if (matchCount > 1) {
      return tabLabels[matchCount];
    }
    if (!finalHasTaken) {
      finalHasTaken = true;
      return "Final";
    }
    return "3rd Place";
  });

  return labels;
}

function _computeActiveRound(data) {
  // 0. default
  if (!data) {
    return 0;
  }

  const winningStatusByRound = [];
  for (const index in data.rounds) {
    const round = data.rounds[index];
    const previousIndex = parseInt(index) - 1;
    const previousStatus = previousIndex > -1 ? winningStatusByRound[previousIndex] : true;

    const thisRoundDone = round.seeds.every((seed) => {
      const thisMatchIsBye = seed.teams.some((team) => team.status === "bye");
      const thisMatchHasWinner = seed.teams.some((team) => Boolean(team.win));
      const thisMatchAllWait = seed.teams.every((team) => team.status === "wait");
      const isDone = thisMatchIsBye || thisMatchHasWinner || (previousStatus && thisMatchAllWait);
      return isDone;
    });

    winningStatusByRound.push(thisRoundDone);
  }

  const thirdPlaceRoundIndex = winningStatusByRound.length - 1;
  const finalRoundIndex = thirdPlaceRoundIndex - 1;

  // 1. Selesai semua babak sampai 3rd place (round terakhir), tampilkan final
  if (winningStatusByRound.every((status) => status === true)) {
    return finalRoundIndex;
  }

  const foundIndex = _getOngoingIndex(winningStatusByRound);

  // 2. Ketika peserta gak "genap" & di babak 3rd place gak ada pertandingan:
  // antara langsung bye (peserta cuman 1) atau gak ada peserta sama sekali.
  if (foundIndex === thirdPlaceRoundIndex) {
    const thirdPlaceSeed = data.rounds[foundIndex].seeds[0];
    const thirdPlaceHasPlayers = _checkValidSeed(thirdPlaceSeed);
    if (!thirdPlaceHasPlayers) {
      return finalRoundIndex;
    }
  }

  // 3. happy path
  return foundIndex;
}

/**
 * Yang ongoing harusnya satu round setelah round
 * yang match-nya udah dapat pemenang semua
 */
function _getOngoingIndex(statusByRound) {
  let foundIndex = 0;
  const rounds = [...statusByRound];
  for (const index in rounds) {
    const status = rounds[index];
    if (status === true) {
      continue;
    }
    foundIndex = parseInt(index);
    break;
  }
  return foundIndex;
}

function _checkValidSeed(seed) {
  const havePlayerNames = seed.teams.every((player) => Boolean(player.name));
  const haveTeamNames = seed.teams.every((team) => Boolean(team.teamName));
  return havePlayerNames || haveTeamNames;
}

export { useBracketTemplate };
