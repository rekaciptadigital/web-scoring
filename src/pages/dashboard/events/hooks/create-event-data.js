import { setHours, setMinutes } from "date-fns";
import { stringUtil } from "utils";

function eventDataReducer(state, action) {
  switch (action.type) {
    /**
     * Registration Datetime & Event Datetime
     */
    case "REGISTRATION_START": {
      let nextState = { ...state, registrationDateStart: action.payload };
      if (action.payload > state.registrationDateEnd || !state.registrationDateEnd) {
        nextState = { ...nextState, registrationDateEnd: action.payload };
      }

      if (action.payload > state.eventDateStart || !state.eventDateStart) {
        nextState = { ...nextState, eventDateStart: action.payload };
      }

      if (action.payload > state.eventDateEnd || !state.eventDateEnd) {
        nextState = { ...nextState, eventDateEnd: action.payload };
      }

      return nextState;
    }

    case "REGISTRATION_END": {
      let nextState = { ...state, registrationDateEnd: action.payload };
      if (action.payload > state.eventDateStart || !state.eventDateStart) {
        nextState = { ...nextState, eventDateStart: action.payload };
      }

      if (action.payload > state.eventDateEnd || !state.eventDateEnd) {
        nextState = { ...nextState, eventDateEnd: action.payload };
      }

      // handle tanggal & jam sebelumnya
      if (action.payload < state.registrationDateStart) {
        nextState = { ...nextState, registrationDateEnd: state.registrationDateStart };
      }

      return nextState;
    }

    case "EVENT_START": {
      let nextState = { ...state, eventDateStart: action.payload };
      if (action.payload > state.eventDateEnd || !state.eventDateEnd) {
        nextState = { ...nextState, eventDateEnd: action.payload };
      }

      // handle tanggal & jam sebelumnya
      if (action.payload < setHours(setMinutes(state.registrationDateEnd, 0), 0)) {
        nextState = { ...nextState, eventDateStart: state.registrationDateEnd };
      }
      return nextState;
    }

    case "EVENT_END": {
      let nextState = { ...state, eventDateEnd: action.payload };
      // handle tanggal & jam sebelumnya
      if (action.payload < state.eventDateStart) {
        nextState = { ...nextState, eventDateEnd: state.eventDateStart };
      }
      return nextState;
    }
    // --- end Registration & Event Datetime

    /**
     * Extra Info
     */
    case "ADD_EXTRA_INFO": {
      return {
        ...state,
        extraInfos: [...state.extraInfos, { key: stringUtil.createRandom(), ...action.value }],
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
    // --- end Extra Info

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
      const categoryKey = stringUtil.createRandom();
      const detailKey = stringUtil.createRandom();
      const { options } = action;

      // Kasih default kategori kompetisi yang belum dipakai
      let chosenCompetitionCategory = null;
      for (const option of options) {
        const isOptionAlreadyChosen = state.eventCategories.some(
          (category) => category.competitionCategory?.value === option.value
        );
        if (isOptionAlreadyChosen) {
          continue;
        }
        chosenCompetitionCategory = { ...option };
        break;
      }

      const newEventCategory = {
        key: categoryKey,
        competitionCategory: chosenCompetitionCategory,
        categoryDetails: [
          {
            categoryKey: categoryKey,
            key: detailKey,
            ageCategory: "",
            teamCategory: "",
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
      const newCopyDetailKey = stringUtil.createRandom();

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

    /**
     * Registration Fees
     */
    case "UPDATE_REGISTRATION_FEES": {
      const { value } = action;

      const byTeamCategory = (fee) => fee.teamCategory === value.teamCategory;
      const targetFeeItem = state.registrationFees.find(byTeamCategory);
      if (!targetFeeItem) {
        const newFeeItem = {
          teamCategory: value.teamCategory,
          amount: value.amount,
        };
        return { ...state, registrationFees: [...state.registrationFees, newFeeItem] };
      }

      const updatedRegistrationFees = state.registrationFees.map((fee) => {
        if (fee.teamCategory !== value.teamCategory) {
          return fee;
        }
        return { ...fee, amount: value.amount };
      });

      return { ...state, registrationFees: updatedRegistrationFees };
    }
    // --- end Registration Fees

    case "UPDATE_EARLYBIRD_REGISTRATION_FEES": {
      const { value } = action;

      const byTeamCategory = (early_bird) => early_bird.teamCategory === value.teamCategory;
      const targetFeeItem = state.earlyBirdRegistrationFees.find(byTeamCategory);
      if (!targetFeeItem) {
        const newFeeItem = {
          teamCategory: value.teamCategory,
          amount: value.amount,
        };
        return { ...state, earlyBirdRegistrationFees: [...state.earlyBirdRegistrationFees, newFeeItem] };
      }

      const updatedRegistrationFees = state.earlyBirdRegistrationFees.map((early_bird) => {
        if (early_bird.teamCategory !== value.teamCategory) {
          return early_bird;
        }
        return { ...early_bird, amount: value.amount };
      });

      return { ...state, earlyBirdRegistrationFees: updatedRegistrationFees };
  }

    case "TOGGLE_FIELD": {
      const { field } = action;
      return {
        ...state,
        [field]: !state[field],
      };
    }

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
