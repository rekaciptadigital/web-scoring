import * as React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import { BreadcrumbDashboard } from "../../components/breadcrumb";

function ContentLayoutWrapper({ children, pageTitle, navbar }) {
  const { state } = useLocation();
  const backButtonURL = state?.from || "/dashboard";
  return (
    <React.Fragment>
      <MetaTags>
        {pageTitle ? <title>{pageTitle} | MyArchery.id</title> : <title>MyArchery.id</title>}
      </MetaTags>

      {navbar}

      <Container fluid>
        <BreadcrumbDashboard to={backButtonURL}>Kembali</BreadcrumbDashboard>
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
