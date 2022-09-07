import * as React from "react";
import { useParams } from "react-router-dom";
import { useEventDetail } from "hooks/event-detail";

const EventDetailContext = React.createContext();

function EventDetailProvider({ children }) {
  const [eventId, setEventId] = React.useState();
  const eventDetailFetcher = useEventDetail(eventId);
  return (
    <EventDetailContext.Provider value={{ ...eventDetailFetcher, setEventId }}>
      {children}
    </EventDetailContext.Provider>
  );
}

function useEventDetailContext() {
  const { event_id } = useParams();
  const context = React.useContext(EventDetailContext);

  React.useEffect(() => {
    if (!event_id) {
      return;
    }
    context.setEventId(parseInt(event_id));
  }, [event_id]);

  return context;
}

export { EventDetailProvider, useEventDetailContext };
