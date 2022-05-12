import React from 'react'
import { Container } from "reactstrap";
import { MetaTags } from "react-meta-tags";

import { SubNavbar } from "../components/submenus-settings";

function PageEventIdCard() {
  return (
    <React.Fragment>
        <SubNavbar eventId={event_id} />
    
        <div>
            <MetaTags>
                <title>Dashboard | Id Card</title>
            </MetaTags>
            <Container fluid>

            </Container>
        </div>
    </React.Fragment>
  )
}

export default PageEventIdCard