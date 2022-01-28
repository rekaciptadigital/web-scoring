import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import EventThumbnailCard from "./EventThumbnailCard";

function makeThumbnailList(initialData) {
  const container = [null, null, null];
  if (!initialData?.length) {
    return container;
  }
  const lastThreeData = initialData.slice(0, 3);
  lastThreeData.forEach((event, index) => {
    container[index] = event;
  });
  return container;
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

function LatestEventList() {
  const [events, setEvents] = React.useState(null);

  React.useEffect(() => {
    const getEvent = async () => {
      const { success, data } = await EventsService.get();
      if (success) {
        const eventsData = data.map((event) => event.event);
        setEvents(eventsData);
      }
    };
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
        makeThumbnailList(events).map((event, index) => {
          return <EventThumbnailCard key={index} event={event} />;
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
