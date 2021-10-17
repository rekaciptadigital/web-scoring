import * as React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";
import { EventsService } from "../../../../services";
import classnames from "classnames";
import { validateFieldsByStep } from "utils/form-wizard-validation";
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
  const [activeTab, setactiveTab] = React.useState(1);
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
        Object.keys(errors).length && dispatch(EventsStore.errors({}));
      }
    }
  }

  const validationConfigCommon = {
    formData,
    activeTab,
    dispatchErrors: (errors) => dispatch(EventsStore.errors(errors)),
  };

  const handleClickTab = (tab) => {
    if (tab > activeTab) {
      for (let count = 1; count <= activeTab; count++) {
        validateFieldsByStep({
          ...validationConfigCommon,
          onValid: () => {
            if (count === activeTab) {
              toggleTab(tab);
            }
          },
        });
      }
    } else if (tab < activeTab) {
      toggleTab(tab);
    } else {
      Object.keys(errors).length && dispatch(EventsStore.errors({}));
    }
  };

  const handleClickNext = () => {
    validateFieldsByStep({
      ...validationConfigCommon,
      onValid: () => {
        toggleTab(activeTab + 1);
      },
    });
  };

  const handleSubmitPublish = () => {
    validateFieldsByStep({
      ...validationConfigCommon,
      onValid: async () => {
        const d = { ...formData };
        d.handbook = null;

        const { data, errors, success, code, message } = await EventsService.register(d);
        if (success) {
          if (data) {
            dispatch(EventsStore.errors(errors));
            toggleTab(activeTab + 1);
          }
        } else {
          if (code === 500) {
            dispatch(EventsStore.errors({ ...errors, code: 500, message }));
          } else if (code === 422) {
            dispatch(EventsStore.errors(errors));
          }
        }
      },
    });
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
                        handleClickTab(1);
                      }}
                    >
                      <span className="number">01</span> Info Umum
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 2 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => {
                        handleClickTab(2);
                      }}
                    >
                      <span className="number">02</span> Harga
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 3 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        handleClickTab(3);
                      }}
                    >
                      <span className="number">03</span> Rincian Tanggal
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 4 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 4 })}
                      onClick={() => {
                        handleClickTab(4);
                      }}
                    >
                      <span className="number">04</span>Daftar Kategori
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 5 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 5 })}
                      onClick={() => {
                        handleClickTab(5);
                      }}
                    >
                      <span className="number">05</span> Publikasi
                    </NavLink>
                  </NavItem>
                  <NavItem className={classnames({ current: activeTab === 6 })}>
                    <NavLink
                      className={classnames({ active: activeTab === 6 })}
                      onClick={() => {
                        handleClickTab(6);
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
                        <Link to="#" onClick={handleSubmitPublish}>
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
