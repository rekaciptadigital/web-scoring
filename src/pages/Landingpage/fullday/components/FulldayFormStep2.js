  import React from "react";
  import { Col, Row } from "reactstrap";
  
  export const FulldayFormStep2 = ({  formData }) => {
    
    return (
      <>
        <Row>
          <Col lg={8}>
            <table className="table">
              <tbody>
                <tr>
                  <td>Email :</td>
                  <td>
                    {formData.email}
                  </td>
                </tr>
                <tr>
                  <td>No. Telp :</td>
                  <td>
                    {formData.phone}
                  </td>
                </tr>
                <tr>
                  <td>Nama Klub :</td>
                  <td>
                    {formData.clubName}
                  </td>
                </tr>
                <tr>
                  <td>Tanggal Lahir :</td>
                  <td>
                    {formData.clubName}
                  </td>
                </tr>
                <tr>
                  <td>Gender :</td>
                  <td>
                    {formData.participantMembers.name}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          
        </Row>
        
        
      </>
    );
  };
  