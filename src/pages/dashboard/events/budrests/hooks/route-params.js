import { useParams, useLocation } from "react-router-dom";

function useRouteQueryParams() {
  const { event_id: param_event_id } = useParams();
  const { search } = useLocation();

  const queryStrings = new URLSearchParams(search);
  const date = queryStrings.get("date");

  const eventId = parseInt(param_event_id);

  return { eventId, date };
}

export { useRouteQueryParams };
