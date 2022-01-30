import * as React from "react";
import styled from "styled-components";

import { ButtonOutline } from "components/ma";
import { FieldSelectCategory } from "../form-fields";
import CategoryDetailList from "./CategoryDetailList";

import Del from "components/icons/Del";

function CategoryItem({ category, categoryOptions, eventData, updateEventData, validationErrors }) {
  // Default kategori kompetisi ketika belum input apapun
  // Defaultnya Barebow, atau kategori pertama yang diberi API
  React.useEffect(() => {
    if (!categoryOptions?.length || category.competitionCategory) {
      return;
    }
    updateEventData({
      type: "UPDATE_EVENT_CATEGORY",
      key: category.key,
      value: { ...categoryOptions[0] },
    });
  }, [categoryOptions, category]);

  const handleClickRemoveCategory = (targetCategory) => {
    updateEventData({ type: "REMOVE_EVENT_CATEGORY", categoryKey: targetCategory.key });
  };

  const handleCategoryNameChange = (category, value) => {
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
          />
        </div>

        <div className="top-grid-actions">
          <ButtonOutline
            onClick={() => handleClickRemoveCategory(category)}
            disabled={eventData.eventCategories.length <= 1}
          >
            <Del />
          </ButtonOutline>
        </div>
      </div>

      <h5 className="mt-3 mb-3 fw-normal">Detail Kategori</h5>
      <CategoryDetailList
        details={category.categoryDetails}
        updateEventData={updateEventData}
        validationErrors={validationErrors}
        shouldDisableDelete={
          eventData.eventCategories.length <= 1 && category.categoryDetails.length <= 1
        }
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
