import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useClubRanksByEvent } from "./hooks/club-ranks-by-event";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { SideBar } from "../components/sidebar";
import { PageHeader } from "../components/page-header";
import { RankingTable } from "./components/ranking-table";

const pageProps = {
  pageTitle: "DOS Medali Klub",
  sidebar: <SideBar />,
};

function PageDosMedalsByClub() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);
  const {
    data: clubRanks,
    isLoading: isLoadingRanks,
    isError: isErrorRanks,
    errors: errorsRanks,
  } = useClubRanksByEvent(eventId);

  const [isLongWait, setLongWait] = React.useState(false);

  React.useEffect(() => {
    if (!clubRanks && isLoadingRanks) {
      const timer = setTimeout(() => {
        setLongWait(true);
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [clubRanks, isLoadingRanks]);

  if (!clubRanks && isErrorRanks) {
    return (
      <PageWrapper {...pageProps}>
        <CardWrapper>
          <Content>
            <p>
              Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
              teknis lebih lanjut:
            </p>

            <pre>{JSON.stringify(errorsRanks)}</pre>
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (!clubRanks && isLoadingRanks) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Pemerolehan Medali Klub" />
        <SpinnerDotBlock
          message={isLongWait && "Sedang mengambil data perolehan medali klub. Tunggu sejenak..."}
        />
      </PageWrapper>
    );
  }

  if (!clubRanks) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Pemerolehan Medali Klub" />
        <CardWrapper>
          <Content>Tidak ada data</Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading="Pemerolehan Medali Klub" />

      <CardWrapper>
        <Content>
          <RankingTable data={clubRanks} />
        </Content>
      </CardWrapper>
    </PageWrapper>
  );
}

/* =============================== */
// styles

const CardWrapper = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const Content = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

export default PageDosMedalsByClub;
