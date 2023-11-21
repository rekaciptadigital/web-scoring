// Impor library dan komponen yang diperlukan
import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { EventsService } from "services";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";


import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { SpinnerDotBlock } from "components/ma";
import CardMenu from "../components/CardMenu";
import CardMenuWithButton from "../components/CardMenuWithButton";


import IconCopy from "components/ma/icons/mono/copy";
import IconInfo from "components/ma/icons/mono/info";
import IconCheck from "components/ma/icons/fill/check";
import { users } from "pages/dashboard/events/home/utils/icon-svgs";


import { eventMenus } from "./utils/menus";
import { target, fileText } from "./utils/icon-svgs";
import { ButtonOutlineBlue } from "components/ma";

/**
 * PageEventDetailHome: Komponen React untuk menampilkan detail sebuah event.
 * Termasuk berbagai opsi manajemen seperti mengedit detail event, manajemen peserta, dll.
 */
function PageEventDetailHome() {
  // Mengambil event_id dari parameter URL
  const { event_id } = useParams();

  // Deklarasi state untuk detail event dan jadwal kualifikasi
  const [eventDetail, setEventDetail] = React.useState(null);
  const [isQualificationSchedulesSet, setIsQualificationSchedulesSet] = React.useState(false);

  // Mengakses profil pengguna dari Redux store
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);

  // Menentukan apakah event telah dipublikasikan
  const isEventPublished = Boolean(eventDetail?.publicInformation.eventStatus);

  // Mengambil peran pengguna
  const roles = userProfile.role.role.id;

  /**
   * renderManageEventMenuBadge: Membuat badge yang menunjukkan status publikasi event.
   * Mengembalikan komponen badge berdasarkan apakah event dipublikasikan atau masih draft.
   */
  const renderManageEventMenuBadge = () => {
    if (!isEventPublished) {
      return (
        <InfoGrayBadge>
          <span className="icon-info">
            <IconInfo size="20" />
          </span>
          <span>Draft</span>
        </InfoGrayBadge>
      );
    }

    return (
      <PublishedBadge>
        <IconCheck size="20" />
        <span>Terpublikasi</span>
      </PublishedBadge>
    );
  };

  /**
   * computeHrefScheduleMenu: Menghitung href untuk menu jadwal.
   * Mengembalikan URL berdasarkan apakah jadwal kualifikasi telah diatur.
   */
  const computeHrefScheduleMenu = () => {
    if (!isQualificationSchedulesSet) {
      return `/dashboard/events/new/prepublish?eventId=${event_id}`;
    }
    return `/dashboard/event/${event_id}/scoring-qualification`;
  };

  // Hook effect untuk mengambil detail event dan jadwal kualifikasi
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
        setIsQualificationSchedulesSet(Boolean(result.data?.length));
      }
    };

    getEventDetail();
    getQualificationSchedules();
  }, []);

  // Rendering komponen utama
  return (
    <StyledPageWrapper>
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
            <DashboardHeading className="mb-5">
              <HeaderMain>
                <h1 className="mb-3">{eventDetail.publicInformation.eventName}</h1>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <LandingPageLinkPlaceholder
                    url={eventDetail.publicInformation.eventUrl || "https://myarchery.id"}
                  />

                  <ButtonOutlineBlue
                    as="a"
                    href={`/dashboard/event/${event_id}/dos-qualification`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ke Halaman DOS
                  </ButtonOutlineBlue>

                  <ButtonOutlineBlue
                    as="a"
                    href={`/live-score/${event_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ke Live Score
                  </ButtonOutlineBlue>
                </div>
              </HeaderMain>

              <div>
                <LinkToDashboard to="/dashboard">
                  <i className="bx bx-left-arrow-alt fs-4" />
                  <span>Ke Beranda</span>
                </LinkToDashboard>
              </div>
            </DashboardHeading>

            <MenuGridWrapper>
              <CardMenu
                menu={eventMenus[1]}
                href={eventMenus[1].computeLink(event_id)}
                badge={renderManageEventMenuBadge()}
                disabled={roles == 4 ? false : true}
              />
              <CardMenu
                menu={eventMenus[8]}
                href={`/dashboard/event/${event_id}/budrests`}
                disabled={roles == 4 ? false : true}
              />

              <CardMenuWithButton
                eventDetail={eventDetail}
                spanLabel={"Peserta Individu : " + eventDetail?.totalParticipantIndividual}
                menu={eventMenus[2]}
                href={`/dashboard/member/${event_id}?type=individual`}
                disabled={roles == 4 ? false : true}
              />

              <CardMenuWithButton
                team={true}
                eventDetail={eventDetail}
                menu={eventMenus[3]}
                spanLabel={"Peserta Beregu : " + eventDetail?.totalParticipantTeam}
                href={`/dashboard/member/${event_id}?type=team`}
                disabled={roles == 4 ? false : true}
              />

              <CardMenu
                menu={{
                  icon: target,
                  title: "Pertandingan",
                  description: "Input skor, hasil skor babak kualifikasi dan eliminasi",
                }}
                href={computeHrefScheduleMenu()}
                disabled={!isQualificationSchedulesSet}
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
                menu={{
                  icon: fileText,
                  title: "Laporan",
                  description: "Laporan jumlah peserta, laporan keuangan, laporan pertandingan",
                }}
                href={`/dashboard/event/${event_id}/reports`}
                disabled={roles == 4 ? false : true}
              />

              <CardMenu
                menu={{
                  icon: fileText,
                  title: "Sertifikat",
                  description: "Master e-sertifikat",
                }}
                href={`/dashboard/certificate/new?event_id=${event_id}`}
                disabled={roles == 4 ? false : true}
              />

              {roles == 4 && (
                <CardMenu
                  menu={{
                    icon: users,
                    title: "Users",
                    description: "Mengatur pengguna pengelola event",
                  }}
                  href={`/dashboard/manage-user/${event_id}`}
                />
              )}
            </MenuGridWrapper>
          </React.Fragment>
        ) : (
          <div>
            <SpinnerDotBlock />
          </div>
        )}
      </Container>
    </StyledPageWrapper>
  );
}

// Styled components untuk styling halaman
const StyledPageWrapper = styled.div`
  margin: 4rem 0;
`;

const DashboardHeading = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
`;

const HeaderMain = styled.div`
  flex: 1 1 0%;
`;

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
    color: var(--ma-gray-400);
  }
`;

const PublishedBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;
`;

function LandingPageLinkPlaceholder({ url = "" }) {
  return (
    <StyledLandingPageLink onClick={() => window.open(url, '_blank')}>
      <StyledLinkInput value={url} placeholder="https://myarchery.id" disabled readOnly />
      <span className="icon-copy">
        <IconCopy size="20" />
      </span>
    </StyledLandingPageLink>
  );
}


const StyledLandingPageLink = styled.div`
  position: relative;
  max-width: 27.5rem;
  cursor: pointer;

  .icon-copy {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: calc(14px + 1.5rem);
    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--ma-blue);
  }
`;

const StyledLinkInput = styled.input`
  display: block;
  padding: 0.5rem 0.75rem;
  padding-right: 2.5rem;
  width: 100%;
  border-radius: 0.25rem;
  border: solid 1px var(--ma-gray-400);
  background-color: transparent;
  color: var(--ma-gray-600);
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #ffffff;
    border-color: var(--ma-gray-200);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
`;

export default PageEventDetailHome;
