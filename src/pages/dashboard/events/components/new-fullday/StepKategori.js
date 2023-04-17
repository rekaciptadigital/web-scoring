import * as React from "react";
import styled from "styled-components";
import { useArcheryCategories } from "utils/hooks/archery-categories";
import { EventsService } from "services";

import { ButtonOutlineBlue } from "components/ma";
import FormSheet from "../FormSheet";
import { CategoryItem } from "../form-category";

export function StepKategori({ eventData, updateEventData, validationErrors }) {
  const { options: categoryOptions } = useArcheryCategories(
    EventsService.getEventCompetitionCategories
  );

  const handleClickAddCategory = () => {
    if (eventData.eventCategories.length === categoryOptions.length) {
      return;
    }
    updateEventData({ type: "ADD_EVENT_CATEGORY", options: categoryOptions });
  };

  return (
    <FormSheet>
      <StyledCategoryList>
        {eventData.eventCategories.map((category) => {
          return (
            <CategoryItem
              key={category.key}
              category={category}
              categoryOptions={categoryOptions}
              eventData={eventData}
              updateEventData={updateEventData}
              validationErrors={validationErrors}
            />
          );
        })}

        <div className="bottom-section-add-category">
          <ButtonOutlineBlue
            corner="8"
            onClick={handleClickAddCategory}
            disabled={
              eventData.eventCategories.length === categoryOptions.length
            }
          >
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
