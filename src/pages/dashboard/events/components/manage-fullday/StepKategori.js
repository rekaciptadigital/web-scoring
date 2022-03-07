import * as React from "react";
import styled from "styled-components";
import { useArcheryCategories } from "utils/hooks/archery-categories";
import { EventsService } from "services";

import { ButtonOutlineBlue } from "components/ma";
import { LoadingScreen } from "components";
import FormSheet from "../FormSheet";
import CategoryItem from "./CategoryItem";

export function StepKategori({
  eventId,
  editIsAllowed,
  savingStatus,
  eventData,
  updateEventData,
  onSaveSuccess,
  validationErrors = {},
  isFormDirty,
  setFormDirty,
}) {
  const { options: optionsCompetitionCategory } = useArcheryCategories(
    EventsService.getEventCompetitionCategories
  );
  const { options: optionsAge } = useArcheryCategories(EventsService.getEventAgeCategories);
  const { options: optionsDistance } = useArcheryCategories(
    EventsService.getEventDistanceCategories
  );
  const { options: optionsTeamCategory } = useArcheryCategories(
    EventsService.getEventTeamCategories
  );
  const [addingCategoryStatus, setAddingCategoryStatus] = React.useState({
    status: "idle",
    errors: null,
  });

  const isLoading = savingStatus.status === "loading";
  const isAddingCategory = addingCategoryStatus.status === "loading";

  const handleClickAddCategory = async () => {
    if (eventData.eventCategories.length >= optionsCompetitionCategory.length) {
      return;
    }

    setAddingCategoryStatus((state) => ({ ...state, status: "loading", errors: null }));

    let chosenCompetitionCategory = null;
    for (const option of optionsCompetitionCategory) {
      const isOptionAlreadyChosen = eventData.eventCategories.some(
        (category) => category.competitionCategory.value === option.value
      );
      if (isOptionAlreadyChosen) {
        continue;
      }
      chosenCompetitionCategory = { ...option };
      break;
    }

    const chosenAge = optionsAge.find((age) => age.value.toLowerCase() === "umum");

    const payload = {
      event_id: eventId,
      competition_category_id: chosenCompetitionCategory.value,
      age_category_id: chosenAge.value,
      distance_id: optionsDistance[0].value,
      team_category_id: optionsTeamCategory[0].value,
      quota: 0,
      fee: 0,
    };

    const result = await EventsService.storeCategoryDetails(payload);
    if (result.success) {
      setAddingCategoryStatus((state) => ({ ...state, status: "success" }));
      onSaveSuccess?.();
    } else {
      setAddingCategoryStatus((state) => ({ ...state, status: "error" }));
    }
  };

  return (
    <FormSheet>
      <StyledCategoryList>
        {eventData.eventCategories.map((category) => {
          return (
            <CategoryItem
              key={category.key}
              eventId={eventId}
              editIsAllowed={editIsAllowed}
              category={category}
              categoryOptions={optionsCompetitionCategory}
              eventData={eventData}
              updateEventData={updateEventData}
              onSuccess={onSaveSuccess}
              validationErrors={validationErrors}
              isFormDirty={isFormDirty}
              setFormDirty={setFormDirty}
            />
          );
        })}

        <div className="bottom-section-add-category">
          <ButtonAddCategory
            disabled={
              !editIsAllowed ||
              eventData.eventCategories.length >= optionsCompetitionCategory.length
            }
            corner="8"
            onClick={handleClickAddCategory}
          >
            + Tambah Kategori
          </ButtonAddCategory>
        </div>
      </StyledCategoryList>

      <LoadingScreen loading={isLoading || isAddingCategory} />
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

const ButtonAddCategory = styled(ButtonOutlineBlue)`
  &:disabled {
    box-shadow: none;
  }
`;
