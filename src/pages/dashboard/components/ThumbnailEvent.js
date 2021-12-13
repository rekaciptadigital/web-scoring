import * as React from "react";
import styled from "styled-components";

import Calendar from "components/icons/Calendar";
import MapPin from "components/icons/MapPin";
import Panah from "components/icons/Panah";

const ThumbnailEventWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 240px;
  padding: 1.5rem 1.5rem 0.85rem 1.5rem;
  border-radius: 8px;

  background-color: #ffffff;

  .event-body {
    overflow-y: hidden;

    .event-icon {
      margin-bottom: 1rem;
    }

    .event-title {
      color: var(--ma-blue);
    }

    .event-city {
      display: flex;
      align-items: center;
      gap: 0.4rem;

      margin-bottom: 0.5rem;
      font-size: 14px;

      .event-city-icon {
        transform: translateY(-2px);
      }
    }

    .event-dates {
      display: flex;
      align-items: center;
      gap: 0.4rem;

      margin-bottom: 0.5rem;
      font-size: 14px;

      .event-dates-icon {
        transform: translateY(-2px);
      }
    }
  }

  .event-footer {
    flex: 0 1 auto;
    text-align: right;

    .event-link::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
`;

function City({ city, children }) {
  if (!(city || children)) {
    return null;
  }
  return (
    <div className="event-city">
      <span className="event-city-icon">
        <MapPin />
      </span>
      <span>{children || city}</span>
    </div>
  );
}

const formatDate = (dateString) => {
  return [...dateString.split(" ")[0].split("-")].reverse().join("/");
};

function EventDates({ from, to }) {
  if (!from || !to) {
    return null;
  }

  return (
    <div className="event-dates">
      <span className="event-dates-icon">
        <Calendar size={16} />
      </span>

      <span>
        {formatDate(from)} - {formatDate(to)}
      </span>
    </div>
  );
}

export default function ThumbnailEvent({ event }) {
  const hrefToEventHome = event?.id ? `/dashboard/event/${event.id}/home` : "";

  return (
    <ThumbnailEventWrapper>
      <div className="event-body">
        <div className="event-icon">
          <Panah size={28} color="#afafaf" />
        </div>
        <h4 className="event-title">{event.eventName}</h4>
        <City>{event.city || "Mock City"}</City>

        <EventDates from={event.eventStartDatetime} to={event.eventEndDatetime} />
      </div>

      <div className="event-footer">
        <a className="event-link" href={hrefToEventHome}>
          <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
        </a>
      </div>
    </ThumbnailEventWrapper>
  );
}
