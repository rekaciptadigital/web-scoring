import React, { useState } from "react";
import { stringUtil } from "utils";
import { computeEventData } from "./utils/event-data";

import { Container } from "reactstrap";
import { Breadcrumbs } from "components";
import FormWizard from "../components/FormWizard";

const EventsNewMarathon = () => {
  const [eventData, setEventData] = useState({
    eventType: "marathon",
    poster: "",
    handbook: "",
    eventName: "",
    picCallCenter: "",
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
    qualificationDays: [
      { id: "monday", label: "Senin", details: [], weekday: true },
      { id: "tuesday", label: "Selasa", details: [], weekday: true },
      { id: "wednesday", label: "Rabu", details: [], weekday: true },
      { id: "thursday", label: "Kamis", details: [], weekday: true },
      { id: "friday", label: "Jumat", details: [], weekday: true },
      { id: "saturday", label: "Sabtu", details: [], weekday: false },
      { id: "sunday", label: "Minggu", details: [], weekday: false },
    ],
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

export default EventsNewMarathon;
