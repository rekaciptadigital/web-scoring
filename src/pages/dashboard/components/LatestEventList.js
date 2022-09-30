import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import EventThumbnailCard from "./EventThumbnailCard";

function makeHomeThumbnailList(initialData, type) {
  let container = [null];
  if (!initialData?.length) {
    return container;
  }
  const maxBoxIndex = 2;
  const lastThreeData = initialData.slice(0, maxBoxIndex);
  switch (type) {
    case "home":
      lastThreeData.forEach((event) => {
        container.push(event);
      });
      return container;
    case "all-event":
      return initialData;
    default:
      break;
  }
  
}

const EventLoadingIndicator = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 240px;
  padding: 1.5rem 1.5rem 0.85rem 1.5rem;
  border-radius: 8px;

  background-color: #ffffff;
`;

function LatestEventList({type}) {
  const [events, setEvents] = React.useState(null);

  const getEvent = async () => {
    setEvents(null);
    const { success, data } = await EventsService.get();
    if (success) {
      const eventsData = data.map((event) => event.event);
      setEvents(eventsData);
    }
  };

  React.useEffect(() => {
    getEvent();
  }, []);

  if (!events) {
    return (
      <EventGrid>
        <EventLoadingIndicator>Sedang memuat data event...</EventLoadingIndicator>
      </EventGrid>
    );
  }

  return (
    <EventGrid>
      {events &&
        makeHomeThumbnailList(events, type).map((event, index) => {
          return <EventThumbnailCard key={index} event={event} getEvent={getEvent}/>;
        })}
    </EventGrid>
  );
}

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export default LatestEventList;
