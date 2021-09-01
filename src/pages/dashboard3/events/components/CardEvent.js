import React from 'react'
import {
    Card,
    CardBody,
    Button,
    Row,
    Col,
  } from "reactstrap";

  import satuDashboard from '../../../../assets/images/myachery/dashboard-1.png'

function CardEvent() {
    return (
        <div>
            <Card className="mini-stats-wid">
                <CardBody>
                    <Row>
                        <Col md={6} sm={12}>
                            <div>
                                <span>
                                    {/* <i className="bx bx-home font-size-24"></i> */}
                                    <img src={satuDashboard} />
                                </span>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div>
                            <h4>Jakarta Archery 2021</h4>
                            <p className="text-muted fw-medium">
                                13 Agustus - 16 Agustus 2021
                            </p>
                            <p className="text-muted fw-medium">
                                Gelora Bung Karno
                            </p>
                            <Button color="primary">Manage Event</Button>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    )
}

export default CardEvent
