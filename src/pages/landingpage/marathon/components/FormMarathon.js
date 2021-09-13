import classnames from "classnames";
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Media, Button
} from "reactstrap";
import { FulldayFormStep1 } from "../../fullday/components/FulldayFormStep1";
import { FulldayFormStep2 } from "../../fullday/components/FulldayFormStep2";
import { FulldayFormStep3 } from "../../fullday/components/FulldayFormStep3";
import styled from "styled-components"

const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  color: #495057;
  display: ruby;
  font-weight: 400;
`;

const Td = styled.td`
  padding-top: 20px;
`;


const FormMarathon = ({ onFormFieldChange, formData }) => {
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
                      <span className="number">1.</span> Pesan
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 2 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => {
                        setactiveTab(2);
                      }}
                    >
                      <span className="number">2.</span> Bayar
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 3 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        setactiveTab(3);
                      }}
                    >
                      <span className="number">3.</span> Selesai
                    </NavLink>
                  </NavItem>
                 
                </ul>
              </div>
              <div className="d-flex">
              <Col sm={8}>
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
              </Col>
              <Col sm={4}>
              {activeTab < 6 && (
                <div className="actions clearfix mt-3">
                    <Card style={{backgroundColor: "#FAFAFA"}}>
                      <CardBody>
                          <Media>
                              <Media body>
                                  <h5 className="mb-3">Tiket Lomba</h5>
                                  <h5 className="mb-3">Order ID 12345</h5>
                                  <tr>
                                      <Td>
                                          <Label>Jenis Regu: </Label>
                                      </Td>
                                      <Td>
                                          Tim
                                      </Td>
                                  </tr>
                                  <tr>
                                      <Td>
                                          <Label>Kategori Lomba: </Label>
                                      </Td>
                                      <Td>
                                          Traditional Bow - U16 - 50m
                                      </Td>
                                  </tr>
                                  <tr>
                                      <Td>
                                          <Label><b>Total: </b> </Label>
                                      </Td>
                                      <Td><b>Rp 100.000</b></Td>
                                  </tr>

                                  <div className="d-grid gap-2 mt-5">
                                  {activeTab === 3 ? (
                                  <Button
                                      type="button"
                                      style={{backgroundColor: "#0D47A1"}}
                                      href="/checkout-event"
                                     >
                                    Selesai
                                  </Button>
                                  ) : (
                                    <Button
                                    type="button"
                                    style={{backgroundColor: "#0D47A1"}}
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}>
                                      Daftar
                                    </Button>
                                  )}
                                  </div>

                              </Media>
                          </Media>
                      </CardBody>
                  </Card>
                </div>
              )}
              </Col>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default FormMarathon;
