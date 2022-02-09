import * as React from "react";
import { EventsService } from "services";

function useEventDetail(eventId) {
  const [eventDetail, dispatch] = React.useReducer((state, action) => ({ ...state, ...action }), {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });

  React.useEffect(() => {
    const fetchEventDetail = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await EventsService.getEventDetailById({ id: eventId });
      if (result.success) {
        dispatch({ status: "success", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.message || result.errors });
      }
    };

    fetchEventDetail();
  }, []);

  return { ...eventDetail, state: eventDetail, dispatch };
}

export { useEventDetail };
