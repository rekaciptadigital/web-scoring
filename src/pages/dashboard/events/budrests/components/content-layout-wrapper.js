import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";

function ContentLayoutWrapper({ children, pageTitle, navbar }) {
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>

      {navbar}

      <Container fluid>
        <StyledPageWrapper>{children}</StyledPageWrapper>
      </Container>
    </React.Fragment>
  );
}

const StyledPageWrapper = styled.div`
  margin: 2.5rem 0;

  @media (min-width: 768px) {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export { ContentLayoutWrapper };
