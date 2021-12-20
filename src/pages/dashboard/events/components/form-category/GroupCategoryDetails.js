import * as React from "react";
import { useCategoryList } from "../../hooks/category-list";

import { ButtonOutline } from "components/ma";
import {
  FieldInputTextSmall,
  FieldSelectKelas,
  FieldSelectMultiJarak,
  FieldSelectJenisRegu,
} from "../form-fields";
import { GroupDetail, DetailItem } from "../form-category";

import Copy from "components/icons/Copy";
import Del from "components/icons/Del";

export default function GroupCategoryDetails({ indexCategory, details }) {
  const { categories: categoryDetails, copyCategory, removeCategory } = useCategoryList(details);

  return (
    <GroupDetail>
      {categoryDetails.map((detail, indexDetail) => (
        <React.Fragment key={indexDetail}>
          <DetailItem>
            <div className="category-field-group">
              <div className="field-grid">
                <FieldSelectKelas
                  name={`category-${indexCategory}-${indexDetail}`}
                  placeholder="Pilih Kelas"
                >
                  Kelas
                </FieldSelectKelas>
              </div>

              <div className="field-grid">
                <FieldSelectMultiJarak
                  name={`distance-${indexCategory}-${indexDetail}`}
                  placeholder="Pilih Jarak"
                >
                  Jarak
                </FieldSelectMultiJarak>
              </div>

              <div className="field-grid">
                <FieldSelectJenisRegu
                  name={`group-${indexCategory}-${indexDetail}`}
                  placeholder="Pilih Jenis Regu"
                >
                  Jenis Regu
                </FieldSelectJenisRegu>
              </div>

              <div className="field-grid">
                <FieldInputTextSmall placeholder="Jumlah">Kuota</FieldInputTextSmall>
              </div>
            </div>

            <div className="field-action">
              <ButtonOutline onClick={() => copyCategory(detail.id)}>
                <Copy />
              </ButtonOutline>
              <ButtonOutline onClick={() => removeCategory(detail.id)}>
                <Del />
              </ButtonOutline>
            </div>
          </DetailItem>

          {indexDetail < categoryDetails.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </GroupDetail>
  );
}
