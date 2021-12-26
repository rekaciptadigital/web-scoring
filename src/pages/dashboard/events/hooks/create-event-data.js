let extraInfoKeyNext = 1;
let categoryKeyNext = 2; // sudah ada default 1 item
let categoryDetailKeyNext = 2; // sudah ada default 1 item

function eventDataReducer(state, action) {
  switch (action.type) {
    /**
     * Extra Info
     */
    case "ADD_EXTRA_INFO": {
      return {
        ...state,
        extraInfos: [...state.extraInfos, { key: extraInfoKeyNext++, ...action.value }],
      };
    }

    case "EDIT_EXTRA_INFO": {
      const { key, value } = action;

      const updatedExtraInfos = state.extraInfos.map((info) => {
        if (info.key !== key) {
          return info;
        }
        return { ...info, ...value };
      });

      return { ...state, extraInfos: updatedExtraInfos };
    }

    case "REMOVE_EXTRA_INFO": {
      const filteredExtraInfos = state.extraInfos.filter((info) => info.key !== action.key);
      return { ...state, extraInfos: filteredExtraInfos };
    }

    /**
     * Category
     */
    case "UPDATE_EVENT_CATEGORY": {
      const { key, value } = action;

      const updatedEventCategories = state.eventCategories.map((category) => {
        if (category.key === key) {
          return { ...category, competitionCategory: value };
        }
        return category;
      });

      return { ...state, eventCategories: updatedEventCategories };
    }

    case "ADD_EVENT_CATEGORY": {
      const categoryKey = categoryKeyNext++;
      const detailKey = categoryDetailKeyNext++;

      const newEventCategory = {
        key: categoryKey,
        categoryDetails: [
          {
            categoryKey: categoryKey,
            key: detailKey,
            ageCategory: "",
            teamType: "",
            distance: "",
            quota: "",
          },
        ],
      };

      return {
        ...state,
        eventCategories: [...state.eventCategories, newEventCategory],
      };
    }

    case "REMOVE_EVENT_CATEGORY": {
      const { eventCategories } = state;
      const { categoryKey } = action;

      if (eventCategories.length <= 1) {
        return state;
      }

      const byCategoryKey = (category) => category.key !== categoryKey;
      return {
        ...state,
        eventCategories: eventCategories.filter(byCategoryKey),
      };
    }
    // --- end Category

    /**
     * Category Detail
     */
    case "UPDATE_EVENT_CATEGORY_DETAIL": {
      const { categoryKey, detailKey, field, value } = action;

      const updatedCategories = state.eventCategories.map((category) => {
        if (category.key !== categoryKey) {
          return category;
        }
        const newDetails = category.categoryDetails.map((detail) => {
          if (detail.key !== detailKey) {
            return detail;
          }
          return { ...detail, [field]: value };
        });
        return { ...category, categoryDetails: newDetails };
      });

      return { ...state, eventCategories: updatedCategories };
    }

    case "COPY_EVENT_CATEGORY_DETAIL": {
      const { eventCategories } = state;
      const { categoryKey, detailKey } = action;
      const newCopyDetailKey = categoryDetailKeyNext++;

      const updatedEventCategories = eventCategories.map((category) => {
        if (category.key !== categoryKey) {
          return category;
        }
        const sourceDetail = category.categoryDetails.find((detail) => detail.key === detailKey);
        return {
          ...category,
          categoryDetails: [
            ...category.categoryDetails,
            {
              ...sourceDetail,
              key: newCopyDetailKey,
              categoryKey: categoryKey,
            },
          ],
        };
      });

      return { ...state, eventCategories: updatedEventCategories };
    }

    case "REMOVE_EVENT_CATEGORY_DETAIL": {
      const { eventCategories } = state;
      const { detailKey, categoryKey } = action;
      const targetCategory = eventCategories.find((category) => category.key === categoryKey);

      if (targetCategory.categoryDetails.length <= 1) {
        return state;
      }

      const updatedCategories = eventCategories.map((category) => {
        if (category.key !== categoryKey) {
          return category;
        }
        const byDetailKey = (detail) => detail.key !== detailKey;
        return {
          ...category,
          categoryDetails: category.categoryDetails.filter(byDetailKey),
        };
      });

      return { ...state, eventCategories: updatedCategories };
    }
    // --- end Category Detail

    default: {
      if (action) {
        /**
         * Update state field primitif.
         * action-nya langsung berisi data
         */
        return { ...state, ...action };
      }

      return state;
    }
  }
}

export { eventDataReducer };
