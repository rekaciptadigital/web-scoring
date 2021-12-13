import * as React from "react";
import { EventsService } from "services";

import { Row, Col } from "reactstrap";
import ThumbnailEvent from "./ThumbnailEvent";
import ThumbnailAdd from "./ThumbnailAdd";

const URL_CREATE_EVENT = "/dashboard/events/new/prepare";

function computeLatestThree(initialData) {
  const container = [null, null, null];

  if (!initialData?.length) {
    return container;
  }

  initialData.forEach((event, index) => {
    container[index] = event;
  });

  return container;

  /**
   * Logic alternatif untuk render versi 1 tombol add aja:
   */
  /* 
  if (initialData?.length < 3) {
    return [...initialData, null];
  } else if (initialData?.length === 3) {
    return initialData;
  }
  return [null];
  */
}

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
          <div>Loading...</div>
        </Col>
      </Row>
    );
  }

  const latestThreeEvents = computeLatestThree(events);

  return (
    <Row>
      {latestThreeEvents?.map((event, index) => {
        if (!event) {
          return (
            <Col key={index} md={4}>
              <ThumbnailAdd href={URL_CREATE_EVENT} />
            </Col>
          );
        }
        return (
          <Col key={index} md={4}>
            <ThumbnailEvent event={event} />
          </Col>
        );
      })}
    </Row>
  );
}

export default LatestEventList;
