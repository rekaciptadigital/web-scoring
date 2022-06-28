import * as React from "react";
import styled from "styled-components";

import Footer from "./Footer.js";

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function LayoutLiveScores({ children }) {
  React.useEffect(() => {
    document.body.setAttribute("data-layout", "horizontal");
    window.scrollTo(0, 0);
  }, []);

  return (
    <StyledLayoutWrapper id="layout-wrapper">
      <div className="main-content">{children}</div>
      <Footer />
    </StyledLayoutWrapper>
  );
}

export default LayoutLiveScores;
