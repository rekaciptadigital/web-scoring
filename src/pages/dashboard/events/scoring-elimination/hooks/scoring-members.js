import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useScoringMembers(
  categoryDetailId,
  inputSearchQuery,
  eliminationParticipantsCount,
  isTeam = false,
  scoreType
) {
  const fetcher = useFetcher();
  const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return ScoringService.getQualificationScoringMembersV2({
        event_category_id: categoryDetailId,
        name: debouncedSearchQuery || undefined,
        elimination_template: eliminationParticipantsCount,
        score_type: scoreType,
      });
    };
    fetcher.runAsync(getFunction, {
      transform: (data) => mapIsPresent(data, isTeam),
    });
  };

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    fetchScoringMembers();
  }, [categoryDetailId, eliminationParticipantsCount, debouncedSearchQuery]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedInputSearchQuery(inputSearchQuery);
    }, DEBOUNCE_TIMER_MS);
    return () => clearTimeout(debounceTimer);
  }, [inputSearchQuery]);

  const searchQuery = debouncedSearchQuery;

  const getSessionNumbersList = () => {
    if (!fetcher.data?.length) {
      return null;
    }
    return Object.keys(fetcher.data[0].sessions)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);
  };

  return {
    ...fetcher,
    searchQuery,
    getSessionNumbersList,
    fetchScoringMembers,
  };
}

function mapIsPresent(initialScoringMembers, isTeam = false) {
  if (isTeam) {
    return initialScoringMembers;
  }
  return initialScoringMembers.map((row) => ({
    ...row,
    member: {
      ...row.member,
      isPresent: Boolean(row.member.isPresent),
    },
  }));
}

export { useScoringMembers };
