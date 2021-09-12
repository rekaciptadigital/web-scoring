import React from 'react'
import { Card, Media, CardBody, Button } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../../assets/images/users/avatar-man.png"

const H5 = styled.h5`
    font-size: 13px;
    line-height: 19px;
    color: #74788D;
    font-weight: normal;
`;


const CardInvoice = () => {
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
                    
                    <H5 className="mx-5">Welcome to MyArchery.id dashboard</H5>
                    <div className="d-flex">
                        <div className="mx-5 text-muted">
                            <h4>John Doe</h4>
                            <H5>Klub FAST</H5>
                        </div>
                        <div className="mx-5 text-muted">
                            <h4>No. Ponsel</h4>
                            <H5>+62 81234 56789</H5>
                        </div>
                        <div className="mx-5 text-muted">
                            <h4>Email</h4>
                            <H5>nama@mail.com</H5>
                        </div>
                    </div>
                    </Media>
                    <Button
                        href="/full-day"
                        type="button"
                        size="sm"
                        style={{backgroundColor: "#0D47A1",  }}>
                        Setting
                    </Button>
                </Media>
            </CardBody>
        </Card>

    )
}

export default CardInvoice
