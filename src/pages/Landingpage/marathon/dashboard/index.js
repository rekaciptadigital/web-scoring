import React, {useState} from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col,  Card, Media, CardBody, Button } from "reactstrap";
import styled from 'styled-components';
import TableSchedule from "./components/TableSchedule";
import CardInfo from "./components/CardInfo";
import { DateInput} from "components";


const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  font-weight: 400;
  color: #495057;
  display: ruby;
  font-style: italic;
`;

const DashboardMarathon = () => {
    const [formData] = useState("");

  return (
    <React.Fragment>
      <MetaTags>
        <title>Marathon | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />
 
        <Container fluid className="px-5 p-2">
            <Row>
                <CardInfo/>
                
                <Card>
                    <CardBody>
                        <Media>
                            <Media body>
                                    <Label>Kualifikasi dapat dilakukan sesuai dengan jadwal yang ditentukan peserta, Anda dapat memilih maksimal 3 sesi pengambilan nilai kualifikasi.</Label>
                                <div className="d-flex mt-3">
                                    <Col sm={8}>
                                        <TableSchedule />
                                    </Col>

                                    <Col sm={4}>

                                        <Card style={{backgroundColor: "#FAFAFA"}}>
                                            <CardBody>
                                                <Media>
                                                    <Media body>
                                                        <label>Kategori Lomba terdaftar</label>
                                                        <p>Individu - Traditional Bow U16 - 50m</p>
                                                        <DateInput
                                                            label="Tanggal"
                                                            name="date"
                                                            value={formData.registrationStartDatetime}
                                                            
                                                        />
                                                    </Media>
                                                </Media>
                                            </CardBody>
                                        </Card>
                                        <Card style={{backgroundColor: "#FAFAFA"}}>
                                            <CardBody>
                                                <Media>
                                                    <Media body>
                                                        <div>
                                                            <label>Jadwal Anda</label>
                                                        </div>

                                                        <div>
                                                            <p>23 September 2021 - Sesi 1 (10.00-11.00)</p>
                                                            <p>23 September 2021 - Sesi 1 (11.00-12.00)</p>
                                                        </div>
                                                        
                                                        <div className="text-center">       <Button
                                                                type="button"
                                                                style={{backgroundColor: "#0D47A1",  }}>
                                                                Simpan
                                                            </Button>
                                                        </div>
                                                      
                                                    </Media>
                                                </Media>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </div>
                            </Media>
                        </Media>
                    </CardBody>
                </Card>
            </Row>
        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default DashboardMarathon
