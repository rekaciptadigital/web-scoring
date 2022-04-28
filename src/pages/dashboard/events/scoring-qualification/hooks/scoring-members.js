import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useScoringMembers(categoryDetailId, inputSearchQuery, eliminationParticipantsCount) {
  const fetcher = useFetcher();
  const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return ScoringService.getQualificationScoringMembersV2({
        event_category_id: categoryDetailId,
        name: debouncedSearchQuery || undefined,
        elimination_template: eliminationParticipantsCount,
      });
    };
    fetcher.runAsync(getFunction, { transform });
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

  const isSearchMode = Boolean(debouncedSearchQuery);

  const getSessionNumbersList = () => {
    if (!fetcher.data?.length) {
      return null;
    }
    return Object.keys(fetcher.data[0].sessions).map((key) => parseInt(key));
  };

  return {
    ...fetcher,
    isSearchMode,
    getSessionNumbersList,
    fetchScoringMembers,
  };
}

function transform(initialScoringMembers) {
  return initialScoringMembers.map((row) => ({
    ...row,
    member: {
      ...row.member,
      isPresent: Boolean(row.member.isPresent),
    },
  }));
}

export { useScoringMembers };
