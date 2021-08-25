import React from "react";
import { Col, Label, Row } from "reactstrap";
import styles from "./style";

export const EventFormStep4 = ({ formData }) => {
  return (
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
                    {item?.teamCategories?.map(
                      (teamCategory, teamCategoryIndex) => {
                        return (
                          <tr key={teamCategory.id}>
                            <td>
                              {
                                formData.eventCategories?.[index]
                                  ?.teamCategories?.[teamCategoryIndex]?.label
                              }
                            </td>
                            <td>
                              {
                                formData.eventCategories?.[index]
                                  ?.teamCategories?.[teamCategoryIndex]?.quota
                              }
                            </td>
                          </tr>
                        );
                      }
                    )}
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
                          <tr key={competitionCategory.name.id}>
                            <td>
                              {
                                formData.eventCategories?.[index]
                                  ?.competitionCategories?.[
                                  competitionCategoryIndex
                                ]?.name?.label
                              }
                            </td>
                            <td>
                              {formData.eventCategories?.[
                                index
                              ]?.competitionCategories?.[
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
  );
};
