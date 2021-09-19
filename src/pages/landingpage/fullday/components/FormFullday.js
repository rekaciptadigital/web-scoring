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
//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

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
  const history = useHistory();
  const [activeTab, setactiveTab] = useState(1);
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState(null);
  const [confirm, setConfirm] = useState(false);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
      }
    }
  }

  const handleValidSubmit = async () => {
    setErrors(null);
    setIsError(false);
    const localFormData = { ...formData };
    localFormData.eventId = eventDetail ? eventDetail.id : 0;
    localFormData.type = formData.type?.id;
    localFormData.participantMembers[0].gender =
      formData.participantMembers[0].gender?.id;
    const { data, errors, message, success } = await OrderEventService.register(
      localFormData
    );
    if (success) {
      if (data) {
        history.push("/checkout-event/" + data.archeryEventParticipantId);
      }
    } else {
      setErrors(errors);
      setIsError(true);
      console.error(message, errors);
    }
  };

  return (
    <div>
      {isError ? (
        <SweetAlert
        title="Oops, data invalid"
        warning
        onConfirm={() => {
          setIsError(false);
          }}
          >
          Pastikan data terisi dengan benar dan lengkap
        </SweetAlert>
      ) : null}
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
                  <Row>
                <Col sm={12} md={8}>
                  <div className="content clearfix mt-4">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={1}>
                        <FulldayFormStep1
                          onFormFieldChange={onFormFieldChange}
                          formData={formData}
                          eventDetail={eventDetail}
                          errors={errors}
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
                  </div>
                </Col>
                <Col sm={12} md={4}>
                  {activeTab < 6 && (
                    <div className="mt-4">
                      <Card style={{ backgroundColor: "#FAFAFA" }}>
                        <CardBody>
                          <Media>
                            <Media body>
                              <h5 className="mb-3">Tiket Lomba</h5>
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <Td>
                                      <Label>Jenis Regu: </Label>
                                    </Td>
                                    <Td>
                                      <strong>{formData.type.id}</strong>
                                    </Td>
                                  </tr>
                                  <tr>
                                    <Td>
                                      <Label>Kategori Lomba: </Label>
                                    </Td>
                                    <Td>
                                      <strong>
                                        {formData.categoryEvent
                                          ? formData.categoryEvent.label
                                          : ""}
                                      </strong>
                                    </Td>
                                  </tr>
                                </tbody>
                              </table>
                              <br></br>
                              <h4
                                style={{ color: "green", textAlign: "center" }}
                                >
                                Rp {formData?.categoryEvent?.price || 0}
                              </h4>
                              <div className="d-grid gap-2 mt-5">
                                {activeTab === 2 ? (
                                  <Button
                                  type="button"
                                  style={{ backgroundColor: "#0D47A1" }}
                                  onClick={() => {
                                    setConfirm(true);
                                  }}
                                  >
                                    Selesai
                                  </Button>
                                ) : (
                                  <Button
                                  type="button"
                                    style={{ backgroundColor: "#0D47A1" }}
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                    >
                                    Pilih Pembayaran
                                  </Button>
                                )}
                                {confirm ? (
                                  <SweetAlert
                                    title="Apakah anda yakin?"
                                    warning
                                    showCancel
                                    confirmButtonText="Ya"
                                    cancelBtnText="Tidak"
                                    confirmBtnBsStyle="success"
                                    cancelBtnBsStyle="danger"
                                    onConfirm={() => {
                                      setConfirm(false);
                                      handleValidSubmit(formData);
                                    }}
                                    onCancel={() => setConfirm(false)}
                                    ></SweetAlert>
                                ) : null}
                              </div>
                            </Media>
                          </Media>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </Col>
                  </Row>
              </div>
            </div>
          </CardBody>
        </Card>
    </div>
  );
};

export default FormFullday;
