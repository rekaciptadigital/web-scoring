import * as React from "react";
import styled from "styled-components";

import { FieldSelectCategory } from "../form-fields";
import CategoryDetailList from "./CategoryDetailList";

function CategoryItem({
  eventId,
  editIsAllowed,
  category,
  categoryOptions,
  eventData,
  updateEventData,
  onSuccess,
  validationErrors,
  isFormDirty,
  setFormDirty,
}) {
  const handleCategoryNameChange = (category, value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({ type: "UPDATE_EVENT_CATEGORY", key: category.key, value });
  };

  const handleDisablingCategoryOptions = (option) => {
    if (option.disabled) {
      return true;
    }
    for (const categories of eventData.eventCategories) {
      if (categories.competitionCategory?.value === option.value) {
        return true;
      }
    }
  };

  return (
    <StyledCategoryItem>
      <div className="top-section">
        <div className="top-grid-select-category">
          <FieldSelectCategory
            options={categoryOptions}
            isOptionDisabled={handleDisablingCategoryOptions}
            value={category.competitionCategory}
            onChange={(value) => handleCategoryNameChange(category, value)}
            errors={validationErrors?.[`${category.key}-competitionCategory`]}
            disabled={!editIsAllowed}
          />
        </div>
      </div>
      <h5 className="mt-3 mb-3 fw-normal">Detail Kategori</h5>
      <CategoryDetailList
        eventId={eventId}
        editIsAllowed={editIsAllowed}
        details={category.categoryDetails}
        updateEventData={updateEventData}
        onSuccess={onSuccess}
        validationErrors={validationErrors}
        isFormDirty={isFormDirty}
        setFormDirty={setFormDirty}
      />
    </StyledCategoryItem>
  );
}

const StyledCategoryItem = styled.div`
  border: solid 1px var(--ma-gray-100);
  border-radius: 4px;
  padding: 1rem;

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: start;

    .top-grid-select-category {
      flex-basis: 240px;
    }

    .top-grid-actions {
      display: flex;
      gap: 0.2rem;
    }
  }
`;

export default CategoryItem;
