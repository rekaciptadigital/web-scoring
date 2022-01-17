import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import { Row, Col } from "reactstrap";
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
      <Row>
        <Col md={4}>
          <EventLoadingIndicator>Sedang memuat data event...</EventLoadingIndicator>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      {events &&
        makeThumbnailList(events).map((event, index) => {
          return (
            <Col key={index} md={4}>
              <EventThumbnailCard event={event} />
            </Col>
          );
        })}
    </Row>
  );
}

export default LatestEventList;
