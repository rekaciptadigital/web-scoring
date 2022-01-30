import * as React from "react";

import EventItemCard from "./EventItemCard";
import EventAddCard from "./EventAddCard";

function EventThumbnailCard({ event }) {
  if (event) {
    return <EventItemCard event={event} />;
  }
  return <EventAddCard href="/dashboard/events/new/prepare" />;
}

export default EventThumbnailCard;
