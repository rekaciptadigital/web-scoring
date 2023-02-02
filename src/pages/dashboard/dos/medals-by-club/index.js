import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useLongWait } from "../hooks/long-wait";
import { useRankingCategories } from "./hooks/ranking-categories";
import { useClubRanksByEvent } from "./hooks/club-ranks-by-event";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "../components/dos-page-wrapper";
import { Knobs } from "../components/toolbar-filters";
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
  const [activeMenu, setActivemenu] = React.useState(0);

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
      <CardWrapper>
        <Content>
          <VerticalSpace>
            <TabsLayout>
              <Knobs
                label="Pemeringkatan"
                labelIsHidden
                knobButtonStyle={{ textTransform: "capitalize" }}
                options={categories.map((category, index) => ({
                  value: index,
                  label: category.label,
                }))}
                activeKnobId={activeMenu}
                onChange={setActivemenu}
              />
            </TabsLayout>

            <RankingView
              key={"ranking-" + activeMenu}
              eventId={eventId}
              category={categories[activeMenu]}
              eventDetail={eventDetail}
            />
          </VerticalSpace>
        </Content>
      </CardWrapper>
    </PageWrapper>
  );
}

function RankingView({ eventId, category, eventDetail }) {
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
      <div>
        <TabelHeading>{category.label}</TabelHeading>
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
      </div>
    );
  }

  if (!clubRanks && isErrorRanks) {
    return (
      <div>
        <TabelHeading>{category.label}</TabelHeading>
        <div>
          <p>
            Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
            teknis lebih lanjut:
          </p>

          <pre>{JSON.stringify(errorsRanks)}</pre>
        </div>
      </div>
    );
  }

  if (!clubRanks) {
    return (
      <div>
        <TabelHeading>{category.label}</TabelHeading>
        <div>Tidak ada data</div>
      </div>
    );
  }

  return (
    <div>
      <TabelHeading>{category.label}</TabelHeading>
      <RankingTable data={clubRanks} eventDetail={eventDetail} />
    </div>
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

const TabsLayout = styled.div`
  > * {
    display: block;

    > * + * {
      margin-top: 0.5rem;
    }
  }
`;

const TabelHeading = styled.h5`
  margin-bottom: 1.25rem;
  color: var(--ma-blue);
  font-weight: 600;
  text-transform: capitalize;
`;

export default PageDosMedalsByClub;
