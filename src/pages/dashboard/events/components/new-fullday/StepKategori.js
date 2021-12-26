import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue } from "components/ma";
import FormSheet from "../FormSheet";
import { CategoryItem } from "../form-category";

const categoryOptions = [
  { label: "Barebow", value: "Barebow" },
  { label: "Compound", value: "Compound" },
  { label: "Recurve", value: "Recurve" },
  { label: "Standard Bow", value: "Standard Bow" },
  { label: "Recurve FITA", value: "Recurve FITA" },
];

export function StepKategori({ eventData, updateEventData }) {
  const handleClickAddCategory = () => {
    if (eventData.eventCategories.length === categoryOptions.length) {
      return;
    }
    updateEventData({ type: "ADD_EVENT_CATEGORY" });
  };

  return (
    <FormSheet>
      <StyledCategoryList>
        {eventData.eventCategories.map((category) => {
          return (
            <CategoryItem
              key={category.key}
              category={category}
              eventData={eventData}
              updateEventData={updateEventData}
            />
          );
        })}

        <div className="bottom-section-add-category">
          <ButtonOutlineBlue corner="8" onClick={handleClickAddCategory}>
            + Tambah Kategori
          </ButtonOutlineBlue>
        </div>
      </StyledCategoryList>
    </FormSheet>
  );
}

const StyledCategoryList = styled.div`
  margin: -1rem -1rem 0 -1rem;

  > * {
    margin-top: 2rem;
  }

  .bottom-section-add-category {
    display: flex;
    justify-content: flex-end;
  }
`;
