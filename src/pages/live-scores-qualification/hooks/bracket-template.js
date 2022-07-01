import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EliminationService } from "services";
import { useDisplaySettings } from "../contexts/display-settings";

const POLLING_INTERVAL = 10000;

function useBracketTemplate({ categoryId, shouldPoll }) {
  const { event_id } = useParams();
  const fetcher = useFetcher();
  const { setRoundOptions, setLastUpdated } = useDisplaySettings();

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

export { useBracketTemplate };
