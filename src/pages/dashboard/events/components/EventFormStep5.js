import * as React from "react";
import { useSelector } from "react-redux";
import * as EventsStore from "store/slice/events";
import ReactHtmlParser from "react-html-parser";
import { selectConstants } from "constants/index";

import { Col, Label, Row, Alert, Collapse } from "reactstrap";
import { Accordion, CheckboxInput, DatetimeInput, SwitchInput } from "components";

import styles from "../styles";

export const EventFormStep5 = ({ onFormFieldChange, formData }) => {
  const { errors } = useSelector(EventsStore.getEventsStore);

  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <React.Fragment>
      {!Object.keys(errors).length || errors.code ? null : (
        <Alert color="warning">Silakan lengkapi data yang perlu diisi</Alert>
      )}
      {!Object.keys(errors).length || errors.code !== 500 ? null : <Alert500 errors={errors} />}

      <Row>
        <Col lg={4}>
          <img
            className="rounded"
            alt="Skote"
            width="100%"
            src={formData.poster ? URL.createObjectURL(formData.poster) : "/images/no-image.jpeg"}
          />
        </Col>

        <Col lg={8}>
          <table className="table">
            <tbody>
              <tr>
                <td>Tanggal Lomba</td>
                <td>
                  {formData.eventStartDatetime} s/d {formData.eventEndDatetime}
                </td>
              </tr>
              <tr>
                <td>Tanggal Pendaftaran</td>
                <td>
                  {formData.registrationStartDatetime} s/d {formData.registrationEndDatetime}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <i className="bx bx-map" /> {formData.location}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>{ReactHtmlParser(formData.description)}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      <Accordion
        separateItem
        items={[
          {
            title: "Kategori yang dipertandingkan",
            body: (
              <Row>
                <Col xs={12}>
                  {formData.eventCategories.filter(Boolean).map((item, index) => (
                    <div key={index} id={"row" + index}>
                      <Row style={styles.categoryBox}>
                        <Col lg={3}>
                          <Label>Kategori Kelas</Label>
                          <br />
                          {formData.eventCategories[index]?.ageCategories?.label}
                        </Col>
                        <Col lg={4}>
                          <Label>Batas Tanggal Lahir</Label>
                          <br />
                          {formData.eventCategories[index]?.maxDateOfBirth}
                        </Col>
                        <Col lg={6}>
                          <Label>Info</Label>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Kategori Regu</th>
                                <th>Kuota</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item?.teamCategories?.map((teamCategory, teamCategoryIndex) => {
                                return (
                                  <tr key={teamCategory.id}>
                                    <td>
                                      {
                                        formData.eventCategories?.[index]?.teamCategories?.[
                                          teamCategoryIndex
                                        ]?.label
                                      }
                                    </td>
                                    <td>
                                      {
                                        formData.eventCategories?.[index]?.teamCategories?.[
                                          teamCategoryIndex
                                        ]?.quota
                                      }
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </Col>
                        <Col lg={6}>
                          <Label>Kategori Lomba</Label>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Kategori</th>
                                <th>Jarak</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item?.competitionCategories
                                ?.filter(Boolean)
                                .map((competitionCategory, competitionCategoryIndex) => {
                                  return (
                                    <tr
                                      key={`${competitionCategory.name?.id}-${competitionCategoryIndex}`}
                                    >
                                      <td>
                                        {
                                          formData.eventCategories?.[index]
                                            ?.competitionCategories?.[competitionCategoryIndex]
                                            ?.name?.label
                                        }
                                      </td>
                                      <td>
                                        {formData.eventCategories?.[index]?.competitionCategories?.[
                                          competitionCategoryIndex
                                        ]?.distances?.join("; ") || ""}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Col>
              </Row>
            ),
          },
        ]}
      />

      <Row className="mb-4">
        <Col lg={12}>
          <CheckboxInput
            label="Siapa yang bisa melihat event Anda?"
            name="targets"
            onChange={handleChange}
            options={selectConstants.eventAudiences}
            inline
            value={formData.targets}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={12}>
          <SwitchInput
            label="Kapan waktu publikasi event Anda?"
            name="publishNow"
            onChange={handleChange}
            value={formData.publishNow}
            inline
            onInfo="Sekarang"
            offInfo="Dijadwalkan"
          />
        </Col>
        {!formData.publishNow && (
          <Col lg={5}>
            <DatetimeInput name="publishDatetime" onChange={handleChange} />
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

function Alert500({ errors }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Alert color="danger">
      <div className="mt-2">
        <p>500 Internal Server Error</p>
        <p>
          <a onClick={() => setIsOpen((state) => !state)}>
            <u>Pesan selengkapnya</u>
          </a>
        </p>
      </div>

      <Collapse isOpen={isOpen}>
        <pre>{errors.message}</pre>
      </Collapse>
    </Alert>
  );
}
