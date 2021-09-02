import React from 'react'
import {
    Card,
    CardBody,
    Row,
    Col
} from 'reactstrap'

function Bantalan() {
    return (
        <div>
            <Card>
                <CardBody>
                    <div className="text-center">
                        <p>Bantalan 1</p>
                    </div>
                    <hr />
                    <div>
                        <Row>
                            <Col md={4}>
                                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                    <p className="avatar-title rounded-circle bg-primary">A</p>
                                </div>
                                <div className="mt-2 text-center lh-1">
                                    <p>ASEP</p>
                                    <p className="text-black-50">FAST</p>
                                    <small className="bg-primary text-white font-size-10">Peringkat 1</small>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex justify-content-center">
                                <h4>VS</h4>
                            </Col>
                            <Col md={4}>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                    <p className="avatar-title rounded-circle bg-primary">A</p>
                                </div>
                                <div className="mt-2 text-center lh-1">
                                    <p>David McHenry</p>
                                    <p className="text-black-50">INDIV</p>
                                    <small className="bg-primary text-white font-size-10">Peringkat 64</small>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default Bantalan
