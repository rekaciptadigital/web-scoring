import * as React from "react";
import styled from "styled-components";

import { ProcessingToast, toast } from "./processing-toast";

function LayoutLiveScores({ children }) {
  React.useEffect(() => {
    document.body.setAttribute("data-layout", "horizontal");
    window.scrollTo(0, 0);

    // cleanup on unmount
    return () => toast.dismiss();
  }, []);

  return (
    <React.Fragment>
      <StyledLayoutWrapper id="layout-wrapper">
        <div className="main-content">{children}</div>
      </StyledLayoutWrapper>
      <ProcessingToast />
    </React.Fragment>
  );
}

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    > *:nth-child(1) {
      flex-grow: 1;
    }
  }
`;

export default LayoutLiveScores;
