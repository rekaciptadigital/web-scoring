import React,{useEffect}from 'react'
import { Card, CardBody, Row, Col } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../../../assets/images/users/avatar-man.png"

const H5 = styled.h5`
    font-size: 13px;
    line-height: 19px;
    color: #74788D;
    font-weight: normal;
`;


const CardInfo = (props) => {
    useEffect(async() => {
        console.log("iiii",props.info)
      }, []);
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md={1} sm={12} className="d-flex d-md-block justify-content-center">
                    <img
                        src={Avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                        style={{height: "auto"}}
                    />
                    </Col>
                    <Col md={11} sm={12}>
                        <div className="text-center text-md-start">
                    
                    <H5 className="mx-md-5">Informasi Peserta</H5>
                    <div className="d-md-flex">
                        <div className="mx-md-5 text-muted">
                            <h4>{props.info.member?.name}</h4>
                            <H5>{props.info?.club}</H5>
                        </div>
                        <div className="mx-md-5 text-muted">
                            <h4>No. Ponsel</h4>
                            <H5>{props.info?.phoneNumber}</H5>
                        </div>
                        <div className="mx-md-5 text-muted">
                            <h4>Email</h4>
                            <H5>{props.info?.email}</H5>
                        </div>
                        <div className="mx-md-5 text-muted">
                            <h4>Age</h4>
                            <H5>{props.info.member?.age}</H5>
                        </div>
                    </div>
                    </div>
                    </Col>
                    </Row>
            </CardBody>
        </Card>

    )
}

export default CardInfo
