import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { LatestEventList,} from "./../../components";

const List = () => {
  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>All Event | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        <h1>Semua Event</h1>
        <p>Rangkaian pertandingan panahan yang Anda selenggarakan</p>
        <div style={{marginTop: 40}}>
        <LatestEventList type={"all-event"} />
        </div>
      </Container>
    </StyledPageWrapper>
  );
};

const StyledPageWrapper = styled.div`
  margin: 4rem 0;
`;

export default List;
