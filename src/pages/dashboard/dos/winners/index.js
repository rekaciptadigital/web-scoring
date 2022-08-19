import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";

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

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading={pageProps.pageTitle} />
      <CardWrapper>
        <Content>
          <div>
            <Knobs label="Hari" />
          </div>

          <SplitSides>
            <WinnerBoxView title="Kualifikasi" />
            <WinnerBoxView title="Eliminasi" />
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

export default PageDosWinners;
