import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useLongWait } from "../hooks/long-wait";
import { useClubRanksByEvent } from "./hooks/club-ranks-by-event";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "../components/dos-page-wrapper";
import { PageHeader } from "../components/page-header";
import { RankingTable } from "./components/ranking-table";

const pageProps = {
  pageTitle: "Medali Klub",
  subHeading: "Perolehan Medali Klub",
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

  const isInitialLoading = !clubRanks && isLoadingRanks;

  const waitTimeIsExceeded = useLongWait(isInitialLoading, 3000);

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

  if (isInitialLoading) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading={pageProps.subHeading} />
        <CardWrapper>
          <Content>
            <SpinnerDotBlock
              message={
                waitTimeIsExceeded && (
                  <p className="text-center">
                    Menyiapkan data perolehan medali klub memakan waktu lebih lama dari biasanya.
                    <br />
                    Mohon tunggu sejenak...
                  </p>
                )
              }
            />
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (!clubRanks) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading={pageProps.subHeading} />
        <CardWrapper>
          <Content>Tidak ada data</Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading={pageProps.subHeading} />
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
