import React, { useState } from "react";
import { Container } from "reactstrap";
import { Breadcrumbs } from "components";
import FormWizard from "../components/FormWizard";
import { stringUtil } from "utils";

const EventsNewMarathon = () => {
  const [eventData, setEventData] = useState({
    eventType: "marathon",
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
    let modifiedEventData = { ...eventData };
    if (key === "registrationFees" || key === "teamCategories") {
      const registrationFees =
        key === "registrationFees" ? value : eventData.registrationFees;
      const categories =
        key === "teamCategories" ? value : eventData.teamCategories;

      const newRegistrationFees = registrationFees.map((item) => {
        const newItem = {
          registrationType: item.registrationType || item.id,
          id: item.id,
          label: item.label,
          price: item.price,
        };
        newItem.categoryPrices = categories.map((categoryItem) => {
          return {
            id: categoryItem.id,
            label: categoryItem.label,
            teamCategory: categoryItem.id,
            price: undefined,
          };
        });

        return newItem;
      });

      modifiedEventData.teamCategories = categories;
      modifiedEventData.registrationFees = newRegistrationFees;
    } else {
      modifiedEventData = _.set(modifiedEventData, key, value);
    }
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
            formData={eventData}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNewMarathon;
