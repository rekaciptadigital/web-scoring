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
  Media,
  Button,
} from "reactstrap";
import { FulldayFormStep1 } from "./FulldayFormStep1";
import { FulldayFormStep2 } from "./FulldayFormStep2";
// import { FulldayFormStep3 } from "./FulldayFormStep3";
import styled from "styled-components";
import { OrderEventService } from "../../../../services";
import { selectConstants } from "constants/index";
import { useHistory } from "react-router-dom";
//tesing post data postman
// import dummy from "./DummyOrderEvent.json";

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

const FormFullday = ({ onFormFieldChange, formData, eventDetail }) => {
  formData.type = selectConstants.fulldayAudience[0];
  console.log("formData",formData);
  const history = useHistory();
  const [activeTab, setactiveTab] = useState(1);
  const [err, seterr] = useState(false);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
      }
    }
  }

  const handleValidSubmit = async () => {
    seterr(false);
    const localFormData = { ...formData };
    localFormData.eventId = eventDetail ? eventDetail.id : 0;
    localFormData.type = formData.type?.id;
    localFormData.participantMembers[0].gender = formData.participantMembers[0].gender?.id;
    const { data, errors, message, success } = await OrderEventService.register(
      localFormData
    );
    if (success) {
      if (data) {
        console.log(data);
        history.push("/checkout-event/"+data.archeryEventParticipantId);
      }
    } else {
      seterr(true);
      console.log(errors);
      console.log(message);
    }
  };

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
                  {/* <NavItem className={classnames({ current: activeTab === 3 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        setactiveTab(3);
                      }}
                    >
                      <span className="number">3.</span> Selesai
                    </NavLink>
                  </NavItem> */}
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
                          eventDetail={eventDetail}
                        />
                      </TabPane>
                      <TabPane tabId={2}>
                        <FulldayFormStep2
                          onFormFieldChange={onFormFieldChange}
                          formData={formData}
                        />
                      </TabPane>
                      {/* <TabPane tabId={3}>
                    <FulldayFormStep3
                      onFormFieldChange={onFormFieldChange}
                      formData={formData}
                      />
                  </TabPane> */}
                    </TabContent>
                    {err ? <p style={{color:"red"}}>*pastikan data terisi dengan benar dan lengkap</p> : <></>}
                  </div>
                </Col>
                <Col sm={4}>
                  {activeTab < 6 && (
                    <div className="actions clearfix mt-3">
                      <Card style={{ backgroundColor: "#FAFAFA" }}>
                        <CardBody>
                          <Media>
                            <Media body>
                              <h5 className="mb-3">Tiket Lomba</h5>
                              <tr>
                                <Td>
                                  <Label>Jenis Regu: </Label>
                                </Td>
                                <Td><strong>{formData.type.id}</strong></Td>
                              </tr>
                              <tr>
                                <Td>
                                  <Label>Kategori Lomba: </Label>
                                </Td>
                                <Td><strong>{formData.categoryEvent ? formData.categoryEvent.label : ""}</strong></Td>
                              </tr>
                              <br></br>
                              <h4 style={{color:"green", textAlign:"center"}}>
                                Rp {eventDetail && eventDetail.isFlatRegistrationFee ? eventDetail.price ? eventDetail.price : 0 : formData && formData.categoryEvent != null &&formData.categoryEvent.price?formData.categoryEvent.price:0}</h4>
                              <div className="d-grid gap-2 mt-5">
                                {activeTab === 2 ? (
                                  <Button
                                    type="button"
                                    style={{ backgroundColor: "#0D47A1" }}
                                    onClick={() => {
                                      handleValidSubmit(formData);
                                    }}
                                  >
                                    Selesai
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    style={{ backgroundColor: "#0D47A1" }}
                                    onClick={() => {
                                      console.log(formData);
                                      toggleTab(activeTab + 1);
                                    }}
                                  >
                                    Pilih Pembayaran
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

export default FormFullday;
