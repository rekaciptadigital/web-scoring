import * as React from "react";

import { Row, Col } from "reactstrap";
import { ButtonOutline } from "components/ma";
import FormSheet from "../FormSheet";
import { FieldInputTextSmall, FieldSelectKelas, FieldSelectCategory } from "../form-fields";
import { GroupCategoryList, GroupCategory, GroupDetail, DetailItem } from "../form-category";

import Copy from "components/icons/Copy";
import Del from "components/icons/Del";

const categories = [0, 1];
const details = [0, 1];

export function Step3() {
  return (
    <FormSheet>
      <GroupCategoryList>
        {categories.map((category, indexCategory) => (
          <GroupCategory key={indexCategory}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <h5 className="mb-3 fw-normal">Kategori Kelas</h5>

              <div
                style={{
                  display: "flex",
                  gap: "0.2rem",
                }}
              >
                <ButtonOutline>
                  <Copy />
                </ButtonOutline>

                <ButtonOutline>
                  <Del />
                </ButtonOutline>
              </div>
            </div>

            <Row>
              <Col md={3}>
                <FieldSelectKelas
                  placeholder="Pilih Kelas"
                  options={[{ label: "Hai", value: "Hai" }]}
                >
                  Kelas
                </FieldSelectKelas>
              </Col>
              <Col md={3}>
                <FieldInputTextSmall name={`age-${indexCategory}`} placeholder="DD/MM/YYYY">
                  Batas Lahir
                </FieldInputTextSmall>
              </Col>
            </Row>

            <h5 className="mt-3 mb-3 fw-normal">Detail Lomba</h5>

            <GroupDetail>
              {details.map((detail, indexDetail) => (
                <React.Fragment key={indexDetail}>
                  <DetailItem>
                    <div className="field-grid select-category">
                      <FieldSelectCategory
                        name={`category-${indexCategory}-${indexDetail}`}
                        placeholder="Pilih Kategori"
                      >
                        Kategori Lomba
                      </FieldSelectCategory>
                    </div>

                    <div className="field-grid select-distance">
                      <FieldSelectCategory
                        name={`distance-${indexCategory}-${indexDetail}`}
                        placeholder="Jarak"
                      >
                        Jarak
                      </FieldSelectCategory>
                    </div>

                    <div className="field-grid">
                      <FieldInputTextSmall
                        name={`female-team-${indexCategory}-${indexDetail}`}
                        placeholder="... tim"
                      >
                        Female Team
                      </FieldInputTextSmall>
                    </div>

                    <div className="field-grid">
                      <FieldInputTextSmall
                        name={`individual-${indexCategory}-${indexDetail}`}
                        placeholder="... orang"
                      >
                        Individual
                      </FieldInputTextSmall>
                    </div>

                    <div className="field-action">
                      <ButtonOutline>
                        Tambah Kuota +
                      </ButtonOutline>
                      <ButtonOutline>
                        <Copy />
                      </ButtonOutline>
                      <ButtonOutline>
                        <Del />
                      </ButtonOutline>
                    </div>
                  </DetailItem>

                  {indexDetail < details.length - 1 && <hr />}
                </React.Fragment>
              ))}
            </GroupDetail>
          </GroupCategory>
        ))}

        <div style={{ marginLeft: "1rem" }}>
          <ButtonOutline>Tambah Kategori +</ButtonOutline>
        </div>
      </GroupCategoryList>
    </FormSheet>
  );
}
