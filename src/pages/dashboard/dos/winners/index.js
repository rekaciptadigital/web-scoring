import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useLongWait } from "../hooks/long-wait";
import { useWinnersByCategory } from "./hooks/winners-by-category";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "../components/dos-page-wrapper";
import { PageHeader } from "../components/page-header";
import { Knobs } from "../components/toolbar-filters";
import { WinnerBoxView } from "./components/winner-box-view";

const pageProps = {
  pageTitle: "Pemenang Kategori",
};

function PageDosWinners() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);
  const {
    data: winners,
    isLoading: isLoadingWinners,
    isError: isErrorWinners,
    errors: errorsWinners,
  } = useWinnersByCategory(eventId);

  const isInitialLoading = !winners && isLoadingWinners;
  const waitTimeIsExceeded = useLongWait(isInitialLoading, 3000);
  const { options: optionsDays, day, setDay } = useDaysFilter(winners);

  const getTableData = (stage) => winners?.[day]?.[stage];

  if (!winners && isErrorWinners) {
    return (
      <PageWrapper {...pageProps}>
        <CardWrapper>
          <Content>
            <p>
              Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
              teknis lebih lanjut:
            </p>

            <pre>{JSON.stringify(errorsWinners)}</pre>
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (isInitialLoading) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading={pageProps.pageTitle} />
        <CardWrapper>
          <Content>
            <SpinnerDotBlock
              message={
                waitTimeIsExceeded && (
                  <p className="text-center">
                    Menyiapkan data pemenang memakan waktu lebih lama dari biasanya.
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

  if (!winners) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading={pageProps.pageTitle} />
        <CardWrapper>
          <Content>Tidak ada data</Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading={pageProps.pageTitle} />
      <CardWrapper>
        <Content>
          <div>
            <Knobs label="Hari" options={optionsDays} activeKnobId={day} onChange={setDay} />
          </div>

          <SplitSides>
            <div>
              <WinnerBoxView title="Kualifikasi" data={getTableData("qualification")} eventDetail={eventDetail} />
            </div>
            <div>
              <WinnerBoxView title="Eliminasi" data={getTableData("elimination")} eventDetail={eventDetail} />
            </div>
          </SplitSides>
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
  padding: 1.25rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.25rem;
  }
`;

const SplitSides = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 1.25rem 1rem;
`;

/* =============================== */
// hooks

function useDaysFilter(winners) {
  const options = React.useMemo(() => {
    const dates = winners ? Object.keys(winners) : [];
    return dates.map((date) => ({ value: date, label: date }));
  }, [winners]);

  const [day, setDay] = React.useState(options[0]?.value);

  React.useEffect(() => {
    if (!winners || day) {
      return;
    }
    setDay(options[0]?.value);
  }, [winners, day, options]);

  return { options, day, setDay };
}

export default PageDosWinners;
