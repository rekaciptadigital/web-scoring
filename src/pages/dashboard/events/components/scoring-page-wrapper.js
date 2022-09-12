import * as React from "react";

import { PageWrapper } from "components/ma/page-wrapper";
import { SubNavbar } from "./submenus-matches";

function ScoringPageWrapper({ children, pageTitle, isSelectionType }) {
  return (
    <PageWrapper pageTitle={pageTitle} navbar={<SubNavbar isSelectionType={isSelectionType} />}>
      {children}
    </PageWrapper>
  );
}

export { ScoringPageWrapper };
