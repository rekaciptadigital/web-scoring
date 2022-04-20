import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useScoringMembers(categoryDetailId, searchQuery) {
  const fetcher = useFetcher();

  const fetchScoringMembers = () => {
    const getFunction = () => {
      return ScoringService.getQualificationScoringMembersV2({
        event_category_id: categoryDetailId,
        name: searchQuery?.name,
      });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    fetchScoringMembers();
  }, [categoryDetailId]);

  const getSessionList = () => {
    if (!fetcher.data?.length) {
      return null;
    }
    return Object.keys(fetcher.data[0].sessions);
  };

  return { ...fetcher, getSessionList, fetchScoringMembers };
}

export { useScoringMembers };
