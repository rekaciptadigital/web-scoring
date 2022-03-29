import { useHistory, useLocation } from "react-router-dom";

function useRouteQueryParams() {
  const history = useHistory();
  const { pathname, search } = useLocation();

  const queryStrings = new URLSearchParams(search);
  const event_id = queryStrings.get("event_id");

  return {
    qs: { event_id },
    setParamEventId(eventId) {
      queryStrings.set("event_id", eventId);
      const URLWithParams = queryStrings.toString();
      history.replace(`${pathname}?${URLWithParams}`);
    },
  };
}

export { useRouteQueryParams };
