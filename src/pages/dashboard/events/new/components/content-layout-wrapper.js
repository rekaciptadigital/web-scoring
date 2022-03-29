import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";

function ContentLayoutWrapper({ children, pageTitle, before, after }) {
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>

      {before}

      <StyledPageWrapper>
        <Container fluid>{children}</Container>
      </StyledPageWrapper>

      {after}
    </React.Fragment>
  );
}

const StyledPageWrapper = styled.div`
  margin: 2.5rem 0;
`;

export { ContentLayoutWrapper };
