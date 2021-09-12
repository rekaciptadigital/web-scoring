import React, { useState } from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import FormMarathon from "./components/FormMarathon";
import { Container, Row } from "reactstrap";
import styled from 'styled-components';
import { stringUtil } from "utils";

const H5 = styled.h5`
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 120%;
    text-align: center;
    color: #495057;
`;


const RegisterMarathon = () => {

    const [eventData, setEventData] = useState({
        eventType: "fullday",
        fulldayAudience: "",
        email: "",
        phone: "",
        clubName: "",
        teamName: "",
        isUserSamePlayer: true,
        category: "",
        gender: "",
        dateBirth: "",
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
      <MetaTags>
        <title>Marathon | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />
      
        <Row className="mt-3">
          <H5>Pendaftaran Jakarta Archery 2021</H5>
        </Row>
 
        <Container fluid className="px-5 p-2">
          <FormMarathon
            onFormFieldChange={(key, value) => handleChange(key, value)}
            formData={eventData}
          />
        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default RegisterMarathon
