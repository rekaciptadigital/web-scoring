import React, { useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import FormWizard from "../components/FormWizard";

const EventsNew = () => {
  const [eventData, setEventData] = useState({
    poster: "",
    handbook: "",
    eventName: "",
    registrationStartDatetime: "",
    registrationEndDatetime: "",
    eventStartDatetime: "",
    eventEndDatetime: "",
    location: "",
    city: "",
    locationType: "",
    description: "",
    isFlatRegistrationFee: true,
    teamCategories: [],
    registrationFee: [],
    eventCategories: [],
    target: "",
    publishDatetime: "",
  });

  const handleChange = (key, value) => {
    const modifiedEventData = { ...eventData };
    modifiedEventData[key] = value;
    setEventData(modifiedEventData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Events"
            breadcrumbItems={[{ title: "Dashboard" }, { title: "Events" }]}
          />
          <FormWizard
            onFormFieldChange={(key, value) => handleChange(key, value)}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNew;
