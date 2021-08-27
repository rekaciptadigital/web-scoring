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
    isFlatRegistrationFee: false,
    registrationFee: [],
    teamCategories: [],
    eventCategories: [],
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

      const newRegistrationFee = registrationFees.map(item => {
        const newItem = {
          registrationType: item.registrationType || item.id,
          id: item.id,
          label: item.label,
          price: item.price,
        };
        newItem.categoryPrice = categories.map(categoryItem => {
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
      modifiedEventData = _.set(
        modifiedEventData,
        key,
        value
      );
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

export default EventsNew;
