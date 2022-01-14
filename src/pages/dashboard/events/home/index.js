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
      return <span>&#40; &#8505; &#41; draft</span>;
    }
    if (!isQualificationSchedulesSet) {
      return <span style={{ color: "green" }}>&#40;&#10003;&#41; Terpublikasi</span>;
    }
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
                <Link to="/dashboard">&larr; Ke Dashboard EO</Link>
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
                href={eventMenus[3].computeLink(event_id)}
                badge={
                  !isQualificationSchedulesSet && <span>&#40; &#8505; &#41; belum diatur</span>
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

const MenuGridWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export default PageEventDetailHome;
