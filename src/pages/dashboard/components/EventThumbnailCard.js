import * as React from "react";

import EventItemCard from "./EventItemCard";
import EventAddCard from "./EventAddCard";

function EventThumbnailCard({ event, getEvent }) {
  if (event) {
    return <EventItemCard event={event} getEvent={getEvent} />;
  }
  return <EventAddCard href="/dashboard/events/new/prepare" />;
}

export default EventThumbnailCard;
