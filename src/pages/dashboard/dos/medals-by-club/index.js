import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useLongWait } from "../hooks/long-wait";
import { useRankingCategories } from "./hooks/ranking-categories";
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
  const { data: categories, isInitialLoading } = useRankingCategories(eventId);

  if (isInitialLoading) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading={pageProps.subHeading} />
        <CardWrapper>
          <Content>
            <SpinnerDotBlock />
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (!categories) {
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
      <VerticalSpace>
        {categories.map((category, index) => (
          <RankingView key={index} eventId={eventId} label={category.label} category={category} />
        ))}
      </VerticalSpace>
    </PageWrapper>
  );
}

function RankingView({ eventId, label, category }) {
  const {
    data: clubRanks,
    isInitialLoading,
    isError: isErrorRanks,
    errors: errorsRanks,
  } = useClubRanksByEvent({
    eventId,
    type: category.type,
    params: category.paramRequestRank,
  });

  const waitTimeIsExceeded = useLongWait(isInitialLoading, 3000);

  if (isInitialLoading) {
    return (
      <CardWrapper>
        <Content>
          <TabelHeading>{label}</TabelHeading>
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
    );
  }

  if (!clubRanks && isErrorRanks) {
    return (
      <CardWrapper>
        <Content>
          <p>
            Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
            teknis lebih lanjut:
          </p>

          <pre>{JSON.stringify(errorsRanks)}</pre>
        </Content>
      </CardWrapper>
    );
  }

  if (!clubRanks) {
    return (
      <CardWrapper>
        <Content>
          <TabelHeading>{label}</TabelHeading>
          <div>Tidak ada data</div>
        </Content>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Content>
        <TabelHeading>{label}</TabelHeading>
        <RankingTable data={clubRanks} />
      </Content>
    </CardWrapper>
  );
}

/* =============================== */
// styles

const CardWrapper = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpace = styled.div`
  > * + * {
    margin-top: 2.5rem;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
`;

const TabelHeading = styled.h5`
  margin-bottom: 1.25rem;
  color: var(--ma-blue);
  font-weight: 600;
  text-transform: capitalize;
`;

export default PageDosMedalsByClub;
