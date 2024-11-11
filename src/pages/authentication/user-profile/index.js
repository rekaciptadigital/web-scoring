// availity-reactstrap-validation
import { AvField, AvForm } from "availity-reactstrap-validation";
import React, { useEffect, useState } from "react";
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';
import {
  Alert, Button, Card, CardBody, Col, Container, Media, Row
} from "reactstrap";
import avatar from "../../../assets/images/users/avatar-man.png";
import Breadcrumb from "../../components/Common/Breadcrumb";

const UserProfile = props => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [id, setId] = useState(1)

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"))
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setName(obj.displayName)
        setEmail(obj.email)
        setId(obj.uid)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setName(obj.username)
        setEmail(obj.email)
        setId(obj.uid)
      }
      setTimeout(() => {
        props.resetProfileFlag();
      }, 3000);
    }
  }, [props.success])

  function handleValidSubmit(event, values) {
    props.editProfile(values)
  }

  return (
    <div className="page-content">
      <MetaTags>
        <title>Profile | MyArchery</title>
      </MetaTags>
      <Container fluid>
        <Breadcrumb title="MyArchery" breadcrumbItems={[{title: "Profile"}]} />

        <Row>
          <Col lg="12">
            {props.error ? (
              <Alert color="danger">{props.error}</Alert>
            ) : null}
            {props.success? (
              <Alert color="success">{props.success}</Alert>
            ) : null}

            <Card>
              <CardBody>
                <Media>
                  <div className="ms-3">
                    <img
                      src={avatar}
                      alt=""
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <Media body className="align-self-center">
                    <div className="text-muted">
                      <h5>{name}</h5>
                      <p className="mb-1">{email}</p>
                      <p className="mb-0">Id no: #{id}</p>
                    </div>
                  </Media>
                </Media>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title mb-4">Change User Name</h4>

        <Card>
          <CardBody>
            <AvForm
              className="form-horizontal"
              onValidSubmit={(e, v) => {
                handleValidSubmit(e, v)
              }}
            >
              <div className="form-group">
                <AvField
                  name="username"
                  label="User Name"
                  value={name}
                  className="form-control"
                  placeholder="Enter User Name"
                  type="text"
                  required
                />
                <AvField name="id" value={id} type="hidden" />
              </div>
              <div className="text-center mt-4">
                <Button type="submit" color="danger">
                  Edit User Name
                </Button>
              </div>
            </AvForm>
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

UserProfile.propTypes = {
  success: PropTypes.string,
  error: PropTypes.string,
  resetProfileFlag: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired
};

UserProfile.defaultProps = {
  success: null,
  error: null
};

export default UserProfile

