import React, { useState } from 'react'
import {
    Card,
    CardBody,
    Button,
    Row,
    Col,
  } from "reactstrap";

  import satuDashboard from '../../../../assets/images/myachery/dashboard-1.png'
//   import poster from '../../../../assets/images/myachery/logo-myarchery.png'


function CardEvent(props) {
    const [check, setCheck] = useState(false)
    const getCheckCopy = () => {
        navigator.clipboard.writeText(props.dataEvent.eventUrl)
        setCheck(true)
    }
    return (
        <div>
            <Card className="mini-stats-wid">
                <CardBody>
                    <Row>
                        <Col md={6} sm={12}>
                            <div>
                                <span>
                                    {/* <i className="bx bx-home font-size-24"></i> */}
                                    <img src={props.dataEvent.poster ? props.dataEvent.poster : satuDashboard} height="120" width="200" />
                                </span>
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div>
                            <h4>{props.dataEvent.eventName}</h4>
                            <p className="text-muted fw-medium">
                                {props.dataEvent.registrationStartDatetime} - {props.dataEvent.registrationEndDatetime}
                            </p>
                            <p className="text-muted fw-medium">
                                {props.dataEvent.location} - {props.dataEvent.locationType}
                            </p>
                            <div className="mb-2">
                                <div className="d-flex">
                                    <a style={{marginRight: '0.5rem'}} target="_blank" rel="noreferrer" href={props.dataEvent.eventUrl}>Link Event</a>
                                    <a onClick={getCheckCopy}>Copy Link</a>
                                    {!check ? null : (<i className="bx bx-check"></i>)}
                                </div>
                            </div>
                                <Button disabled color="primary">Manage Event</Button>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    )
}

export default CardEvent
