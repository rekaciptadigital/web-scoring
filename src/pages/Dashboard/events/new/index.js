import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import FormWizard from "../components/FormWizard";

const EventsNew = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Events"
            breadcrumbItems={[{ title: "Dashboard" }, { title: "Events" }]}
          />

          <FormWizard />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNew;
