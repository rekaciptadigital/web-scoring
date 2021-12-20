import * as React from "react";
import { useCategoryList } from "../../hooks/category-list";

import { ButtonOutline, ButtonOutlineBlue } from "components/ma";
import FormSheet from "../FormSheet";
import { FieldSelectCategory } from "../form-fields";
import { GroupCategoryList, GroupCategory, GroupCategoryDetails } from "../form-category";

import Copy from "components/icons/Copy";
import Del from "components/icons/Del";

const initialCategories = [{ id: 1 }];
const details = [{ id: 1 }];

// eslint-disable-next-line no-unused-vars
export function StepKategori({ eventData, onChange }) {
  const { categories, addCategory, copyCategory, removeCategory } =
    useCategoryList(initialCategories);

  const handleClickAddCategory = () => {
    addCategory();
  };

  const handleClickCopyCategory = (category) => {
    return () => copyCategory(category.id);
  };

  const handleClickRemoveCategory = (category) => {
    return () => removeCategory(category.id);
  };

  return (
    <FormSheet>
      <GroupCategoryList>
        {categories.map((category, indexCategory) => (
          <GroupCategory key={category.id}>
            <div className="top-section">
              <div className="top-grid-select-category">
                <FieldSelectCategory
                  placeholder="Pilih Kategori"
                  defaultValue={{ label: "Barebow", value: "Barebow" }}
                />
              </div>

              <div className="top-grid-actions">
                <ButtonOutline onClick={handleClickCopyCategory(category)}>
                  <Copy />
                </ButtonOutline>

                <ButtonOutline onClick={handleClickRemoveCategory(category)}>
                  <Del />
                </ButtonOutline>
              </div>
            </div>

            <h5 className="mt-3 mb-3 fw-normal">Detail Kategori</h5>
            <GroupCategoryDetails details={details} indexCategory={indexCategory} />
          </GroupCategory>
        ))}

        <div className="bottom-section-add-category">
          <ButtonOutlineBlue corner="8" onClick={handleClickAddCategory}>
            + Tambah Kategori
          </ButtonOutlineBlue>
        </div>
      </GroupCategoryList>
    </FormSheet>
  );
}
