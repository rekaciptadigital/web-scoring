import * as React from "react";
import styled from "styled-components";

import Header from "./Header";
import Footer from "./Footer.js";

function LayoutDashboardDos({ children }) {
  React.useEffect(() => {
    document.body.setAttribute("data-layout", "horizontal");
    window.scrollTo(0, 0);
  }, []);

  return (
    <StyledLayoutWrapper id="layout-wrapper">
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </StyledLayoutWrapper>
  );
}

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex-grow: 1;
    padding-top: var(--ma-header-height);
    display: flex;
    flex-direction: column;

    > * {
      flex-grow: 1;
    }
  }
`;

export default LayoutDashboardDos;
