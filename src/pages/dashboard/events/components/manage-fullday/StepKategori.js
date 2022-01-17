import * as React from "react";
import styled from "styled-components";
import { useArcheryCategories } from "utils/hooks/archery-categories";
import { EventsService } from "services";

import { ButtonOutlineBlue } from "components/ma";
import { LoadingScreen } from "components";
import FormSheet from "../FormSheet";
import CategoryItem from "./CategoryItem";

export function StepKategori({ eventId, savingStatus, eventData, updateEventData, onSaveSuccess }) {
  const { options: categoryOptions } = useArcheryCategories(
    EventsService.getEventCompetitionCategories
  );

  const isLoading = savingStatus.status === "loading";

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
              eventId={eventId}
              category={category}
              categoryOptions={categoryOptions}
              eventData={eventData}
              updateEventData={updateEventData}
              onSuccess={onSaveSuccess}
            />
          );
        })}

        <div className="bottom-section-add-category">
          <ButtonOutlineBlue corner="8" onClick={handleClickAddCategory}>
            + Tambah Kategori
          </ButtonOutlineBlue>
        </div>
      </StyledCategoryList>

      <LoadingScreen loading={isLoading} />
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
