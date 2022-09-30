import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import { Link } from "react-router-dom";
import Calendar from "components/icons/Calendar";
import MapPin from "components/icons/MapPin";
import Panah from "components/icons/Panah";
// import IconMoreVertical from "components/ma/icons/fill/more-vertical";
import { ButtonMoreMenu } from "../hooks/more-menu";

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
    overflow: "hidden";

    .event-icon {
      display: flex;
      // justify-content: flex-end;
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.5rem;

    .footer-date {
      flex: 1 0 100%;
    }

    // .event-link::before {
    //   content: " ";
    //   position: absolute;
    //   top: 0;
    //   right: 0;
    //   bottom: 0;
    //   left: 0;
    // }
  }

  &:hover {
    box-shadow: 0 0.25rem 0.8rem rgb(18 38 63 / 7.5%);
  }
`;

function EventItemCard({ event, getEvent }) {
  const [eventDetail, setEventDetail] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });

  const eventDetailData = eventDetail.data;
  const hrefToEventHome = event?.id ? `/dashboard/event/${event.id}/home` : "#";

  const getEventDetail = async () => {
    setEventDetail((state) => ({ ...state, status: "loading", errors: null }));
    const result = await EventsService.getEventDetailById({ id: event.id });
    if (result.success) {
      setEventDetail((state) => ({ ...state, status: "success", data: result.data }));
    } else {
      setEventDetail((state) => ({ ...state, status: "error", errors: result.errors }));
    }
  };

  React.useEffect(() => {
    getEventDetail();
  }, []);

  return (
    <EventItemCardWrapper>
      <div className="event-body">
        <div className="event-icon">
          <Panah size={28} color="#afafaf" />
          <Publish
            className={eventDetailData?.publicInformation.eventStatus ? "publikasi" : "draft"}
          >
            <p>{eventDetailData?.publicInformation.eventStatus ? "Terpublikasi" : "Draft"}</p>
          </Publish>
          <div style={{ marginLeft: "auto" }}>
            <ButtonMoreMenu event={eventDetailData} fetchEventDetail={getEventDetail} getEvent={getEvent}/>
          </div>
        </div>
        <h4 className="event-title">
          {eventDetailData?.publicInformation.eventName || "Nama Event tidak tersedia"}
        </h4>
        <EventCity>{eventDetailData?.publicInformation.eventCity?.nameCity}</EventCity>
      </div>

      <div className="event-footer">
        <div className="footer-date">
          <EventDateRange
            from={eventDetailData?.publicInformation.eventStart}
            to={eventDetailData?.publicInformation.eventEnd}
          />
        </div>

        <div>
          <StatusLabel eventDetailData={eventDetailData} />
        </div>

        <div>
          <Link className="event-link" to={hrefToEventHome}>
            <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
          </Link>
        </div>
      </div>
    </EventItemCardWrapper>
  );
}

function StatusLabel({ eventDetailData }) {
  const [isQualificationSchedulesSet, setIsQualificationSchedulesSet] = React.useState(false);

  const { id: eventId } = eventDetailData || {};
  const isEventPublished = Boolean(parseInt(eventDetailData?.publicInformation.eventStatus));

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    const getQualificationSchedules = async () => {
      const result = await EventsService.getEventQualificationSchedules({ event_id: eventId });
      if (result.success) {
        setIsQualificationSchedulesSet(Boolean(result.data?.length));
      }
    };
    getQualificationSchedules();
  }, [eventId]);

  if (!isEventPublished) {
    return (
      <WarningBadge>
        <span className="icon-info">&#8505;</span>
        <span>Atur Pertandingan</span>
      </WarningBadge>
    );
  }

  if (!isQualificationSchedulesSet) {
    return (
      <WarningBadge>
        <span className="icon-info">&#8505;</span>
        <span>Atur Jadwal</span>
      </WarningBadge>
    );
  }

  return null;
}

const WarningBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 2rem;
  background-color: var(--ma-gray-100);
  font-size: 12px;

  .icon-info {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background-color: #ffffff;
    color: var(--ma-gray-400);
    font-size: 15px;
    font-style: italic;
  }
`;

const Publish = styled.div`
  box-sizing: border-box;
  border-radius: 24px;

  height: 23px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height */

  /* Gray/500 */

  color: #757575;
  margin-left: 10px;

  padding-top: 3px;
  padding-right: 10px;
  padding-left: 10px;

  text-align: center;

  &.draft {
    color: #757575;
    border: 1px solid #757575;
  }

  &.publikasi {
    border: 1px solid #05944f;
    color: #05944f;
  }
`;

export default EventItemCard;
