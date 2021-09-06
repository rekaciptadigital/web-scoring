// import PropTypes from 'prop-types'
import TableCategory from "pages/dashboard/category/components/TableCategory";
import React from "react"
import { Card, CardBody, Col, Media } from "reactstrap"
import styled from "styled-components"

const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  color: #495057;
  display: ruby;
  font-style: italic;
`;


const CardQualification = () => {
  return (
    <React.Fragment>
        <Col md="12" >
        <Card>
            <CardBody>
              <Media>
                <Media body>
                    <h5 className="mb-3">Jadwal Kualifikasi</h5>
                    <Label>Peserta dapat memilih maksimal 3 sesi</Label>
                    <TableCategory />
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        
    </React.Fragment>
  )
}


export default CardQualification
