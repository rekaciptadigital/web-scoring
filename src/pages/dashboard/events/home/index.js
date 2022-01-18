import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import CardMenu from "../components/CardMenu";

import { eventMenus } from "./utils/menus";

function PageEventDetailHome() {
  const { event_id } = useParams();
  const [eventDetail, setEventDetail] = React.useState(null);
  const [isQualificationSchedulesSet, setIsQualificationSchedulesSet] = React.useState(false);

  const isEventPublished = Boolean(eventDetail?.publicInformation.eventStatus);

  const renderManageEventMenuBadge = () => {
    if (!isEventPublished && !isQualificationSchedulesSet) {
      return (
        <InfoGrayBadge>
          <span className="icon-info">&#8505;</span>
          <span>Draft</span>
        </InfoGrayBadge>
      );
    }
    if (!isQualificationSchedulesSet) {
      return (
        <PublishedBadge>
          <span className="icon-check">&#10003;</span>
          <span>Terpublikasi</span>
        </PublishedBadge>
      );
    }
  };

  const computeHrefScheduleMenu = () => {
    if (!isQualificationSchedulesSet) {
      return `/dashboard/events/new/prepublish?eventId=${event_id}`;
    }
    // TODO: ke page manage jadwal & skor yang sebenernya
    return "#";
  };

  React.useEffect(() => {
    const getEventDetail = async () => {
      const result = await EventsService.getEventDetailById({ id: event_id });
      if (result.success) {
        setEventDetail(result.data);
      }
    };

    const getQualificationSchedules = async () => {
      const result = await EventsService.getEventQualificationSchedules({ event_id });
      if (result.success) {
        setIsQualificationSchedulesSet(Boolean(result.data.length));
      }
    };

    getEventDetail();
    getQualificationSchedules();
  }, []);

  return (
    <div className="page-content">
      <MetaTags>
        {eventDetail ? (
          <title>Dashboard | Event {eventDetail.publicInformation.eventName}</title>
        ) : (
          <title>Dashboard | Event</title>
        )}
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        {eventDetail ? (
          <React.Fragment>
            <div className="d-flex justify-content-between">
              <div>
                <h1>{eventDetail.publicInformation.eventName}</h1>
                <p>Atur eventmu di sini</p>
              </div>
              <div>
                <LinkToDashboard to="/dashboard">
                  <i className="bx bx-left-arrow-alt fs-4" />
                  <span>Ke Dashboard EO</span>
                </LinkToDashboard>
              </div>
            </div>

            <MenuGridWrapper>
              <CardMenu
                menu={eventMenus[1]}
                href={eventMenus[1].computeLink(event_id)}
                badge={renderManageEventMenuBadge()}
              />
              <CardMenu
                menu={eventMenus[2]}
                href={eventMenus[2].computeLink(event_id)}
                disabled={!isQualificationSchedulesSet}
              />
              <CardMenu
                menu={eventMenus[3]}
                href={computeHrefScheduleMenu}
                disabled={!isEventPublished}
                badge={
                  !isQualificationSchedulesSet && (
                    <InfoGrayBadge>
                      <span className="icon-info">&#8505;</span>
                      <span>Belum Diatur</span>
                    </InfoGrayBadge>
                  )
                }
              />
              <CardMenu
                menu={eventMenus[4]}
                href={eventMenus[4].computeLink(event_id)}
                disabled={!isQualificationSchedulesSet}
              />
              <CardMenu
                menu={eventMenus[5]}
                href={eventMenus[5].computeLink(event_id)}
                disabled={!isQualificationSchedulesSet}
              />
              <CardMenu
                menu={eventMenus[6]}
                href={eventMenus[6].computeLink(event_id)}
                disabled={!isQualificationSchedulesSet}
              />
            </MenuGridWrapper>
          </React.Fragment>
        ) : (
          <div>Sedang memuat data event...</div>
        )}
      </Container>
    </div>
  );
}

const LinkToDashboard = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 12px;
  border-radius: 2rem;
  background-color: var(--ma-gray-100);
  color: var(--ma-blue);

  &:hover {
    color: var(--ma-blue);
  }
`;

const MenuGridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const InfoGrayBadge = styled.div`
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

const PublishedBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;

  .icon-check {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background-color: #3aa76d;
    color: #ffffff;
    font-size: 15px;
  }
`;

export default PageEventDetailHome;
