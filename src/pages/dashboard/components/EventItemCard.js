import * as React from "react";
import styled from "styled-components";

import Calendar from "components/icons/Calendar";
import MapPin from "components/icons/MapPin";
import Panah from "components/icons/Panah";

const formatDate = (datetimeString) => {
  // YYYY-MM-DD
  const date = datetimeString.split(" ")[0].split("-");
  // DD/MM/YYYY
  return date.reverse().join("/");
};

const InfoDisplayWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  margin-bottom: 0.5rem;
  font-size: 14px;

  .icon {
    transform: translateY(-2px);
  }
`;

function EventCity({ children, city }) {
  const cityTextLabel = children || city || "Lokasi tidak tersedia";
  return (
    <InfoDisplayWrapper>
      <span className="icon">
        <MapPin />
      </span>
      <span>{cityTextLabel}</span>
    </InfoDisplayWrapper>
  );
}

function EventDateRange({ from, to }) {
  const isDateAvailable = from && to;

  const dateRange = isDateAvailable
    ? `${formatDate(from)} - ${formatDate(to)}`
    : "Tanggal tidak tersedia";

  return (
    <InfoDisplayWrapper>
      <span className="icon">
        <Calendar size={16} />
      </span>
      <span>{dateRange}</span>
    </InfoDisplayWrapper>
  );
}

const EventItemCardWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 240px;
  padding: 1.5rem 1.5rem 0.85rem 1.5rem;
  border-radius: 8px;

  background-color: #ffffff;
  transition: all 0.4s;

  .event-body {
    overflow-y: hidden;

    .event-icon {
      margin-bottom: 1rem;
    }

    .event-title {
      color: var(--ma-blue);
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

  &:hover {
    box-shadow: 0 0.25rem 0.8rem rgb(18 38 63 / 7.5%);
  }
`;

function EventItemCard({ event }) {
  const hrefToEventHome = event?.id ? `/dashboard/event/${event.id}/home` : "";

  return (
    <EventItemCardWrapper>
      <div className="event-body">
        <div className="event-icon">
          <Panah size={28} color="#afafaf" />
        </div>
        <h4 className="event-title">{event.eventName}</h4>
        <EventCity>{event.city}</EventCity>

        <EventDateRange from={event.eventStartDatetime} to={event.eventEndDatetime} />
      </div>

      <div className="event-footer">
        <a className="event-link" href={hrefToEventHome}>
          <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
        </a>
      </div>
    </EventItemCardWrapper>
  );
}

export default EventItemCard;
