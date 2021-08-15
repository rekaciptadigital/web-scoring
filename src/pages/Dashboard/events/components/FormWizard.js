import classnames from "classnames";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { EventFormStep1 } from "./EventFormStep1";
import { EventFormStep2 } from "./EventFormStep2";
import { EventFormStep3 } from "./EventFormStep3";
import { EventFormStep4 } from "./EventFormStep4";

const FormWizard = () => {
  const [activeTab, setactiveTab] = useState(1);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
      }
    }
  }

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardBody>
            <div className="wizard clearfix">
              <div className="steps clearfix">
                <ul>
                  <NavItem className={classnames({ current: activeTab === 1 })}>
                    <NavLink
                      className={classnames({ current: activeTab === 1 })}
                      onClick={() => {
                        setactiveTab(1);
                      }}
                    >
                      <span className="number">01</span> Info Umum
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 2 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => {
                        setactiveTab(2);
                      }}
                    >
                      <span className="number ms-2">02</span> Harga
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 3 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        setactiveTab(3);
                      }}
                    >
                      <span className="number">03</span> Kategori
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 4 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 4 })}
                      onClick={() => {
                        setactiveTab(4);
                      }}
                    >
                      <span className="number">04</span> Publish
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
              <div className="content clearfix mt-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <EventFormStep1 />
                  </TabPane>
                  <TabPane tabId={2}>
                    <EventFormStep2 />
                  </TabPane>
                  <TabPane tabId={3}>
                    <EventFormStep3 />
                  </TabPane>
                  <TabPane tabId={4}>
                    <EventFormStep4 />
                  </TabPane>
                </TabContent>
              </div>
              <div className="actions clearfix">
                <ul>
                  <li
                    className={
                      activeTab === 1 ? "previous disabled" : "previous"
                    }
                  >
                    <Link
                      to="#"
                      onClick={() => {
                        toggleTab(activeTab - 1);
                      }}
                    >
                      Previous
                    </Link>
                  </li>
                  {activeTab === 4 ? (
                    <li className="next">
                      <Link
                        to="#"
                        onClick={() => {
                          toggleTab(activeTab + 1);
                        }}
                      >
                        Publish
                      </Link>
                    </li>
                  ) : (
                    <li className="next">
                      <Link
                        to="#"
                        onClick={() => {
                          toggleTab(activeTab + 1);
                        }}
                      >
                        Next
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default FormWizard;
