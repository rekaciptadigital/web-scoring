import React, { useState } from "react";
import { stringUtil } from "utils";
import { computeEventData } from "./utils/event-data";

import { Container } from "reactstrap";
import { Breadcrumbs } from "components";
import FormWizard from "../components/FormWizard";

const EventsNewFullday = () => {
  const [eventData, setEventData] = useState({
    eventType: "fullday",
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
    isFlatRegistrationFee: "0",
    registrationFees: [
      {
        id: "normal",
        label: "Normal",
        checkedRequired: true,
      },
    ],
    teamCategories: [],
    eventCategories: [
      {
        id: stringUtil.createRandom(),
        competitionCategories: [
          {
            id: stringUtil.createRandom(),
          },
        ],
      },
    ],
    targets: "",
    publishNow: true,
    publishDatetime: "",
  });

  const handleChange = (key, value) => {
    setEventData(computeEventData(key, value));
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
            formData={eventData}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNewFullday;
