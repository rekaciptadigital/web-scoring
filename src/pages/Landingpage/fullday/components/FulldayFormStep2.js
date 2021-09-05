  import React from "react";
  import { Col, Row } from "reactstrap";
  import CardTicket from "./cardTicket";
  
  export const FulldayFormStep2 = ({  formData }) => {
    
    return (
      <>
        <Row>
          <Col lg={8}>
            <table className="table">
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>
                    {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                  </td>
                </tr>
                <tr>
                  <td>No. Telp</td>
                  <td>
                    {formData.registrationStartDatetime} s/d{" "}
                    {formData.registrationEndDatetime}
                  </td>
                </tr>
                <tr>
                  <td>Nama Klub</td>
                  <td>
                    {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                  </td>
                </tr>
                <tr>
                  <td>Nama Pemanah 1</td>
                  <td>
                    {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                  </td>
                </tr>
                <tr>
                  <td>Nama Pemanah 2</td>
                  <td>
                    {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col lg={4}>
            <CardTicket/>
          </Col>

        </Row>
        
        
      </>
    );
  };
  