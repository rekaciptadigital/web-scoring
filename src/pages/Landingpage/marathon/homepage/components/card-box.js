// import PropTypes from 'prop-types'
import React from "react"
import { Card, CardBody, Col, Media, Row } from "reactstrap"
import TableCategory from "./TableCategoryMarathon"
import styled from "styled-components"

const Td = styled.td`
  padding-top: 12px;
`;
const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  color: #495057;
  display: ruby;
  font-weight: 400;
`;

const landingTimeLocation = [
    {
        id: "1",
        label: "Pendaftaran Hingga",
        icon: "far fa-calendar",
        content: "9 Agustus 2021 (24.00 WIB)"
    },
    {
        id: "2",
        label: "Tanggal Lomba",
        icon: "far fa-calendar",
        content: "13 Agustus - 16 Agustus 2021"
    },
    {
        id: "3",
        label: "Lokasi",
        icon: "fas fa-map-marker-alt",
        content: "Gelora Bung Karno, DKI Jakarta Indoor | Outdoor"
    },
    {
        id: "4",
        label: "No. Telepon",
        icon: "fas fa-phone-alt",
        content: "+62 3456 7890"
    },

]

const CardBox = () => {
  return (
    <React.Fragment>
        <Col md="5" >
          <Card>
            <CardBody>
              <Media>
                <Media body>
                  <h5>Waktu dan Tempat</h5>
                 {landingTimeLocation.map((i, key) => (

                     <tr key={key}>
                      <Td>
                        <Label className="text-muted text-Truncate mb-0 me-3">
                        {i.label}
                        </Label>
                      </Td>
                      <Td>
                        <i className={"me-2 " + i.icon}/>
                      </Td>
                      <Td>
                        <p className="mb-0 font-weight-bold">
                            {i.content}
                        </p>
                      </Td>
                  </tr>
                ))}

                <div className="mt-3">
                  <h5>Unduhan</h5>
                  <Row>
                    <Col sm="6">
                      <p className="font-size-14">Technical Handbook
                        <br/><Label>Size: 3.25 MB</Label>
                      </p>
                    </Col>
                    <Col sm="6">
                      <i className="fas fa-download font-size-14"/> 
                    </Col>
                  </Row>
                    
                  
                </div>

                  
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="7" >
          <Card>
            <CardBody>
              <Media>
                <Media body>
                    <h5 className="mb-3">Kategori Lomba</h5>
                    <Label>U-16 | Batas Lahir: 31/12/2009</Label>
                    <TableCategory/>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
    </React.Fragment>
  )
}


export default CardBox
