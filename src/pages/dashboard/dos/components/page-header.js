import * as React from "react";
import styled from "styled-components";

function PageHeader({ eventDetail, subHeading }) {
  if (!eventDetail?.eventName) {
    return null;
  }

  return (
    <Header>
      <EventNameHeading>{eventDetail.eventName}</EventNameHeading>
      {subHeading && <SubHeading>{subHeading}</SubHeading>}
    </Header>
  );
}

const Header = styled.header`
  margin-top: 3.5rem;
  margin-bottom: 1.75rem;
`;

const EventNameHeading = styled.h2`
  color: var(--ma-blue);
  font-weight: 600;
`;

const SubHeading = styled.h5`
  color: var(--ma-gray-500);
`;

export { PageHeader };
