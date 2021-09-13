import React, { useState, useEffect } from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import FormFullday from "./components/FormFullday";
import { Container, Row } from "reactstrap";
import styled from 'styled-components';
import { stringUtil } from "utils";
import { CategoryService } from "services";
import {useParams} from "react-router-dom";

const H5 = styled.h5`
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 120%;
    text-align: center;
    color: #495057;
`;


const RegisterFullday = () => {
    const {slug} = useParams();
    const [eventData, setEventData] = useState({
        eventType: "fullday",
        type: "",
        email: "",
        phone: "",
        clubName: "",
        teamName: "",
        isUserSamePlayer: true,
        category: "",
        gender: "",
        dateBirth: "",
        participantMembers: [
          {
              name: "",
              birthdate: "",
              gender: ""
          }
        ],
        categoryEvent: null,
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
        team_category_id: "individu",
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

  useEffect(() => {
    const slugData = {slug}
    const {data, errors, success, message} = CategoryService.get(slugData);
    console.log(data, errors, success, message)
    if (success) {
      if (data) {
        console.log(data)
        }
      } else {
        console.log(errors)
        console.log(message)
      }
  });

  console.log(eventData)

  return (
    <React.Fragment>
      <MetaTags>
        <title>ICO Landing | Skote - React Admin & Dashboard Template</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />
      
        <Row className="mt-3">
          <H5>Pendaftaran Jakarta Archery 2021</H5>
        </Row>
 
        <Container fluid className="px-5 p-2">
          <FormFullday
            onFormFieldChange={(key, value) => handleChange(key, value)}
            formData={eventData}
          />
        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default RegisterFullday
