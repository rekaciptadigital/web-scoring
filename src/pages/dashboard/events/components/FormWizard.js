import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";
import { EventsService } from "../../../../services";
import classnames from "classnames";
import { validateFieldsByStep } from "./_helpers/form-wizard-validation";
// import dummy from "../new/DummyEvent.json" //Coba mengunankan data json yang ada pada postman
// import { objectUtil } from "utils";

import { Card, CardBody, Col, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import FormWizardDisplay from "./FormWizardDisplay";
import { EventFormStep1 } from "./EventFormStep1";
import { EventFormStep2 } from "./EventFormStep2";
import { EventFormStep3 } from "./EventFormStep3";
import { EventFormStep4 } from "./EventFormStep4";
import { EventFormStep5 } from "./EventFormStep5";
import { EventFormStep6 } from "./EventFormStep6";

const FormWizard = ({ onFormFieldChange, formData }) => {
  const history = useHistory();
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();
  const [activeTab, setactiveTab] = React.useState(1);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
      }
    }
  }

  const handleClickNext = () => {
    validateFieldsByStep({
      formData,
      activeTab,
      dispatchErrors: (errors) => {
        dispatch(EventsStore.errors(errors));
      },
      onValid: () => {
        toggleTab(activeTab + 1);
      },
    });
  };

  const handleValidSubmit = async (values) => {
    const d = { ...values };
    d.handbook = null;
    const { data, errors, message, success } = await EventsService.register(d);
    if (success) {
      if (data) {
        history.push("/dashboard/events");
        dispatch(EventsStore.errors(errors));
      }
    } else {
      dispatch(EventsStore.errors(errors));
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
                  <NavItem className={classnames({ current: activeTab === 4 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 4 })}
                      onClick={() => {
                        setactiveTab(4);
                      }}
                    >
                      <span className="number">04</span>Daftar Kategori
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 5 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 5 })}
                      onClick={() => {
                        setactiveTab(5);
                      }}
                    >
                      <span className="number">05</span> Publikasi
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 6 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 6 })}
                      onClick={() => {
                        setactiveTab(6);
                      }}
                    >
                      <span className="number">06</span> Selesai
                    </NavLink>
                  </NavItem>
                </ul>
              </div>
              <div className="content clearfix mt-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <FormWizardDisplay tabId={1} activeTab={activeTab}>
                      <EventFormStep1 onFormFieldChange={onFormFieldChange} formData={formData} />
                    </FormWizardDisplay>
                  </TabPane>
                  <TabPane tabId={2}>
                    <FormWizardDisplay tabId={2} activeTab={activeTab}>
                      <EventFormStep2 onFormFieldChange={onFormFieldChange} formData={formData} />
                    </FormWizardDisplay>
                  </TabPane>
                  <TabPane tabId={3}>
                    <FormWizardDisplay tabId={3} activeTab={activeTab}>
                      <EventFormStep3 onFormFieldChange={onFormFieldChange} formData={formData} />
                    </FormWizardDisplay>
                  </TabPane>
                  <TabPane tabId={4}>
                    <FormWizardDisplay tabId={4} activeTab={activeTab}>
                      <EventFormStep4 onFormFieldChange={onFormFieldChange} formData={formData} />
                    </FormWizardDisplay>
                  </TabPane>
                  <TabPane tabId={5}>
                    <FormWizardDisplay tabId={5} activeTab={activeTab}>
                      <EventFormStep5 onFormFieldChange={onFormFieldChange} formData={formData} />
                    </FormWizardDisplay>
                  </TabPane>
                  <TabPane tabId={6}>
                    <FormWizardDisplay tabId={6} activeTab={activeTab}>
                      <EventFormStep6 />
                    </FormWizardDisplay>
                  </TabPane>
                </TabContent>
              </div>
              {activeTab < 6 && (
                <div className="actions clearfix">
                  <ul>
                    <li className={activeTab === 1 ? "previous disabled" : "previous"}>
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
                            handleValidSubmit(formData);
                          }}
                        >
                          Publish
                        </Link>
                      </li>
                    ) : (
                      <li className="next">
                        <Link to="#" onClick={handleClickNext}>
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

export default FormWizard;
