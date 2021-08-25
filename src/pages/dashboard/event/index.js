import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Col,
  Container,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
//Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";
import CardEvent from "./components/CardEvent";

const ListEvent = () => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false)

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | List - Event</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs title="Dashboards" breadcrumbItem="Dashboard" /> */}
          <div className="mb-3">
            <Row>
              <Col md={6}>
              <Dropdown
                isOpen={isOpenDropDown}
                toggle={() =>
                  setIsOpenDropDown(!isOpenDropDown)
                }
                >
                <DropdownToggle
                  tag="button"
                  className="btn btn-primary"
                  >
                  On Going Event <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Action</DropdownItem>
                  <DropdownItem>Another action</DropdownItem>
                  <DropdownItem>Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>{" "}
              </Col>
              <Col md={6}>
                <div className="float-end">
                  <Button className="bg-white"><span style={{color: '#000'}}>List Event</span></Button>
                  <Button className="mx-2 bg-white"><span style={{color: '#000'}}>Kalender</span></Button>
                  <Button color="primary">Tambah Event</Button>
                </div>
              </Col>
              </Row>
          </div>

          {/* / */}

          <Row>
            <Col md={6}>
              <CardEvent />
            </Col>
            <Col md={6}>
              <CardEvent />
            </Col>
            <Col md={6}>
              <CardEvent />
            </Col>
            <Col md={6}>
              <CardEvent />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListEvent;
