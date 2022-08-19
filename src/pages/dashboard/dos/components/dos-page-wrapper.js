import * as React from "react";

import { PageWrapper as GeneralPageWrapper } from "components/ma/page-wrapper";
import { SideBar } from "./sidebar";

function PageWrapper({ children, pageTitle }) {
  const dosPageTitle = pageTitle ? "DOS " + pageTitle : "DOS";
  return (
    <GeneralPageWrapper pageTitle={dosPageTitle} sidebar={<SideBar />}>
      {children}
    </GeneralPageWrapper>
  );
}

export { PageWrapper };
