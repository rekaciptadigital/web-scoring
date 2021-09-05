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
  TabPane
} from "reactstrap";
import { objectUtil } from "utils";
import { FulldayFormStep1 } from "./FulldayFormStep1";
import { FulldayFormStep2 } from "./FulldayFormStep2";
import { FulldayFormStep3 } from "./FulldayFormStep3";

const FormFullday = ({ onFormFieldChange, formData }) => {
  const [activeTab, setactiveTab] = useState(1);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
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
                      <span className="number">02</span> Harga
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 3 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        setactiveTab(3);
                      }}
                    >
                      <span className="number">03</span> Rincian Tanggal
                    </NavLink>
                  </NavItem>
                 
                </ul>
              </div>
              <div className="content clearfix mt-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <FulldayFormStep1
                      onFormFieldChange={onFormFieldChange}
                      formData={formData}
                    />
                  </TabPane>
                  <TabPane tabId={2}>
                    <FulldayFormStep2
                      onFormFieldChange={onFormFieldChange}
                      formData={formData}
                    />
                  </TabPane>
                  <TabPane tabId={3}>
                    <FulldayFormStep3
                      onFormFieldChange={onFormFieldChange}
                      formData={formData}
                    />
                  </TabPane>
                </TabContent>
              </div>
              {activeTab < 6 && (
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
                    {activeTab === 5 ? (
                      <li className="next">
                        <Link
                          to="#"
                          onClick={() => {
                            console.log(JSON.stringify(objectUtil.sanitize(formData)))
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
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default FormFullday;
