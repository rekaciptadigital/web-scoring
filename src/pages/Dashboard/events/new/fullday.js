import React, { useState } from "react";
import { Container } from "reactstrap";
import { Breadcrumbs } from "components";
import FormWizard from "../components/FormWizard";
import { stringUtil } from "utils";

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
    isFlatRegistrationFee: true,
    registrationFee: [
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
    target: "",
    publishNow: true,
    publishDatetime: "",
  });

  const handleChange = (key, value) => {
    let modifiedEventData = { ...eventData };
    if (key === "registrationFee" || key === "teamCategories") {
      const registrationFees =
        key === "registrationFee" ? value : eventData.registrationFee;
      const categories =
        key === "teamCategories" ? value : eventData.teamCategories;

      const newRegistrationFee = registrationFees.map((item) => {
        const newItem = {
          registrationType: item.registrationType || item.id,
          id: item.id,
          label: item.label,
          price: item.price,
        };
        newItem.categoryPrice = categories.map((categoryItem) => {
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
      modifiedEventData.registrationFee = newRegistrationFee;
    } else {
      modifiedEventData = _.set(modifiedEventData, key, value);
    }
    setEventData(modifiedEventData);
    console.log(modifiedEventData)
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
