import React,{useEffect}from 'react'
import { Card, Media, CardBody } from "reactstrap";
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
                <Media>
                    <div className="ms-3">
                    <img
                        src={Avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                    />
                    </div>
                    <Media body className="align-self-center">
                    
                    <H5 className="mx-5">Informasi Peserta</H5>
                    <div className="d-flex">
                        <div className="mx-5 text-muted">
                            <h4>{props.info.member?.name}</h4>
                            <H5>{props.info?.club}</H5>
                        </div>
                        <div className="mx-5 text-muted">
                            <h4>No. Ponsel</h4>
                            <H5>{props.info?.phoneNumber}</H5>
                        </div>
                        <div className="mx-5 text-muted">
                            <h4>Email</h4>
                            <H5>{props.info?.email}</H5>
                        </div>
                        <div className="mx-5 text-muted">
                            <h4>Age</h4>
                            <H5>{props.info.member?.age}</H5>
                        </div>
                    </div>
                    </Media>
                </Media>
            </CardBody>
        </Card>

    )
}

export default CardInfo
