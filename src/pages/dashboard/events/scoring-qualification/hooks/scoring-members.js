import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useScoringMembers(categoryDetailId, searchQuery, eliminationParticipantsCount) {
  const fetcher = useFetcher();

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return ScoringService.getQualificationScoringMembersV2({
        event_category_id: categoryDetailId,
        name: searchQuery?.name,
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
  }, [categoryDetailId, eliminationParticipantsCount]);

  const getSessionNumbersList = () => {
    if (!fetcher.data?.length) {
      return null;
    }
    return Object.keys(fetcher.data[0].sessions).map((key) => parseInt(key));
  };

  return { ...fetcher, getSessionNumbersList, fetchScoringMembers };
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
