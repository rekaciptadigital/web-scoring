import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventQualificationService } from "services";
import { useDisplaySettings } from "../contexts/display-settings";

const POLLING_INTERVAL = 10000;

function useParticipantScorings({ categoryId, teamType, shouldPoll }) {
  const fetcher = useFetcher();
  const { setLastUpdated } = useDisplaySettings();

  const isLoading = !fetcher.data && fetcher.isLoading;
  const isFetching = fetcher.data && fetcher.isLoading;

  React.useEffect(() => {
    if (!categoryId) {
      return;
    }

    const getFunction = async () => {
      const queryParams = { event_category_id: categoryId };
      return EventQualificationService.getParticipantScoring(queryParams);
    };

    const getData = () => {
      const options = {
        transform: getDataTransformer(teamType),
        onSuccess() {
          setLastUpdated(() => new Date());
        },
      };
      fetcher.runAsync(getFunction, options);
    };

    getData();

    if (!shouldPoll) {
      return;
    }

    const scoringPollingTimer = setInterval(() => {
      getData();
    }, POLLING_INTERVAL);

    // clean up
    return () => clearInterval(scoringPollingTimer);
  }, [categoryId, shouldPoll]);

  return { ...fetcher, isLoading, isFetching };
}

function getDataTransformer(teamType) {
  return (originalData) => {
    if (!originalData) {
      return [];
    }

    if (teamType === "individu") {
      const checkMemberIds = new Set();
      return originalData.filter((row) => {
        return !checkMemberIds.has(row.member.id) && checkMemberIds.add(row.member.id);
      });
    }

    if (teamType === "team") {
      const checkParticipantIds = new Set();
      return originalData.filter((row) => {
        return (
          !checkParticipantIds.has(row.participantId) && checkParticipantIds.add(row.participantId)
        );
      });
    }

    return originalData;
  };
}

export { useParticipantScorings };
