import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

const DEBOUNCE_TIMER_MS = 650;

function useScoringMembers({
  categoryDetail,
  inputSearchQuery,
  eventId,
  isTeam = false,
  status = 0,
}) {
  const fetcher = useFetcher();
  const [debouncedSearchQuery, setDebouncedInputSearchQuery] = React.useState("");
  const { categoryDetailId, originalCategoryDetail } = categoryDetail || {};
  const { competitionCategoryId, ageCategoryId, teamCategoryId } = originalCategoryDetail || {};

  const fetchScoringMembers = () => {
    const getFunction = () => {
      if (isTeam) {
        return EventsService.getEventMemberTeam({
          // biar gak paginate sementara
          // TODO: implemen pagination
          limit: 100,
          page: 1,
          event_id: eventId,
          competition_category_id: competitionCategoryId,
          age_category_id: ageCategoryId,
          team_category_id: teamCategoryId,
          status: status || undefined,
          // TODO: pakai buat search? sementara gak dikirim dulu
          // name: inputSearchQuery || undefined,
        });
      }

      return EventsService.getEventMemberNew({
        is_pagination: 1,
        event_id: eventId,
        event_category_id: categoryDetailId,
        status: status || undefined,
        // TODO: pakai buat search? sementara gak dikirim dulu
        // name: debouncedSearchQuery || undefined,
      });
    };
    fetcher.runAsync(getFunction, { transform });
  };

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    fetchScoringMembers();
  }, [isTeam, categoryDetailId, debouncedSearchQuery, status]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedInputSearchQuery(inputSearchQuery);
    }, DEBOUNCE_TIMER_MS);
    return () => clearTimeout(debounceTimer);
  }, [inputSearchQuery]);

  const searchQuery = debouncedSearchQuery;

  return {
    ...fetcher,
    searchQuery,
    fetchScoringMembers,
  };
}

function transform(initialScoringMembers) {
  return initialScoringMembers?.map((row) => ({
    ...row,
    member: {
      ...row,
    },
  }));
}

export { useScoringMembers };
