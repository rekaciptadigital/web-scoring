import { useParams, useHistory, useLocation } from "react-router-dom";

function useRouteQueryParams() {
  const { event_id: param_event_id } = useParams();
  const { pathname, search } = useLocation();
  const history = useHistory();

  const queryStrings = new URLSearchParams(search);
  const qs_event_id = queryStrings.get("event_id");

  const eventId = makeEventIdFromRoute(param_event_id, qs_event_id);
  const isManageEvent = Boolean(param_event_id);
  const isCreateEvent = !param_event_id && qs_event_id;

  const setParamEventId = (eventId) => {
    queryStrings.set("event_id", eventId);
    const URLWithParams = queryStrings.toString();
    history.replace(`${pathname}?${URLWithParams}`);
  };

  return { eventId, isManageEvent, isCreateEvent, setParamEventId };
}

function makeEventIdFromRoute(param_event_id, qs_event_id) {
  if (param_event_id) {
    return parseInt(param_event_id);
  }
  if (qs_event_id) {
    return parseInt(qs_event_id);
  }
  return null;
}

export { useRouteQueryParams };
