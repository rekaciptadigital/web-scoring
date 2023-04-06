import * as React from "react";
import { stringUtil } from "utils";
import { makeStateCategories } from "../utils/event-categories";

function useFormCategories(eventDetail) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    dispatch({
      type: "INIT_FORM",
      payload: eventDetail?.eventCategories?.length
        ? eventDetail?.eventCategories
        : undefined,
    });
  }, [eventDetail]);

  const selectCompetitionCategory = (key, value) => {
    dispatch({
      type: "COMPETITION_CATEGORY_CHANGE",
      key: key,
      payload: value,
    });
  };

  const selectCategoryDetailItem = (fieldName, keyParent, key, value) => {
    dispatch({
      type: "CATEGORY_DETAIL_ITEM_CHANGE",
      field: fieldName,
      key: { parent: keyParent, target: key },
      payload: value,
    });
  };

  const setQuotaAmount = (teamCategoryId, keyParent, key, value) => {
    dispatch({
      type: "QUOTA_CHANGE",
      key: { parent: keyParent, target: key },
      teamCategoryId: teamCategoryId,
      payload: value,
    });
  };

  const createEmptyCategory = () => dispatch({ type: "CREATE_EMPTY_CATEGORY" });

  const setMaxLengthFromOptions = (value) => {
    dispatch({ type: "MAX_LENGTH_CHANGE", payload: value });
  };

  const removeCategoryByKey = (key) => {
    dispatch({ type: "REMOVE_CATEGORY", key: key });
  };

  const createEmptyCategoryDetail = (key) => {
    dispatch({ type: "CREATE_EMPTY_CATEGORY_DETAIL", key });
  };

  const removeCategoryDetailByKey = (keyParent, key) => {
    dispatch({
      type: "REMOVE_CATEGORY_DETAIL",
      key: { parent: keyParent, target: key },
    });
  };

  return {
    ...state,
    selectCompetitionCategory,
    selectCategoryDetailItem,
    setQuotaAmount,
    createEmptyCategory,
    setMaxLengthFromOptions,
    removeCategoryByKey,
    createEmptyCategoryDetail,
    removeCategoryDetailByKey,
  };
}

function formReducer(state, action) {
  switch (action.type) {
    case "INIT_FORM": {
      /**
       * payload-nya `eventCategories`
       */
      if (!action.payload) {
        return { ...state, data: makeDefaultCategoryData(), isEmpty: true };
      }
      return {
        ...state,
        data: makeStateCategories(action.payload),
        isEmpty: computeFormIsEmpty(action.payload),
      };
    }

    case "CREATE_EMPTY_CATEGORY": {
      const newCategory = makeDefaultCategoryData()[0];
      newCategory.categoryDetails[0].quotas =
        newCategory.categoryDetails[0].quotas.map((quota, index) => ({
          ...quota,
          isShow: state.data[0].categoryDetails[0].quotas[index].isShow,
        }));

      return {
        ...state,
        data: [...state.data, newCategory],
      };
    }

    case "REMOVE_CATEGORY": {
      return {
        ...state,
        data: state.data.filter((category) => category.key !== action.key),
      };
    }

    case "CREATE_EMPTY_CATEGORY_DETAIL": {
      return {
        ...state,
        data: state.data.map((category) => {
          if (category.key !== action.key) {
            return category;
          }
          const newDetail = makeDefaultCategoryData()[0].categoryDetails[0];
          const createdQuotaList = {
            ...newDetail,
            quotas: newDetail.quotas.map((quota, index) => ({
              ...quota,
              isShow: category.categoryDetails[0].quotas[index].isShow,
            })),
          };

          return {
            ...category,
            categoryDetails: [...category.categoryDetails, createdQuotaList],
          };
        }),
      };
    }

    case "REMOVE_CATEGORY_DETAIL": {
      return {
        ...state,
        data: state.data.map((category) => {
          if (category.key !== action.key.parent) {
            return category;
          }
          return {
            ...category,
            categoryDetails: category.categoryDetails.filter(
              (detail) => detail.key !== action.key.target
            ),
          };
        }),
      };
    }

    case "MAX_LENGTH_CHANGE": {
      return { ...state, maxLength: action.payload };
    }

    case "COMPETITION_CATEGORY_CHANGE": {
      return {
        ...state,
        data: state.data.map((category) => {
          if (category.key !== action.key) {
            return category;
          }
          return {
            ...category,
            competitionCategoryId: action.payload,
          };
        }),
      };
    }

    case "CATEGORY_DETAIL_ITEM_CHANGE": {
      return {
        ...state,
        data: state.data.map((category) => {
          if (category.key !== action.key.parent) {
            return category;
          }
          return {
            ...category,
            categoryDetails: category.categoryDetails.map((detail) => {
              if (detail.key !== action.key.target) {
                return detail;
              }
              return {
                ...detail,
                [action.field]: action.payload,
              };
            }),
          };
        }),
      };
    }

    case "QUOTA_CHANGE": {
      return {
        ...state,
        data: state.data.map((category) => {
          if (category.key !== action.key.parent) {
            return category;
          }
          return {
            ...category,
            categoryDetails: category.categoryDetails.map((detail) => {
              if (detail.key !== action.key.target) {
                return detail;
              }
              return {
                ...detail,
                quotas: detail.quotas.map((quotaItem) => {
                  if (quotaItem.teamCategoryId !== action.teamCategoryId) {
                    return quotaItem;
                  }
                  return {
                    ...quotaItem,
                    quota: Number(action.payload) || "",
                  };
                }),
              };
            }),
          };
        }),
      };
    }
  }
}

const makeDefaultCategoryData = () => [
  {
    key: stringUtil.createRandom(),
    competitionCategoryId: null, // exp: { label: "Barebow", value: "Barebow" }
    categoryDetails: [
      {
        key: stringUtil.createRandom(),
        // ageCategoryId: null,
        // distanceId: null,
        ageCategoryId: { value: "Umum", label: "Umum" },
        distanceId: { value: 5, label: "5m" },
        quotas: [
          {
            categoryDetailsId: undefined,
            teamCategoryId: "individu male",
            teamCategoryLabel: "Individu Putra",
            quota: "",
            isShow: true,
          },
          {
            categoryDetailsId: undefined,
            teamCategoryId: "individu female",
            teamCategoryLabel: "Individu Putri",
            quota: "",
            isShow: true,
          },
          {
            categoryDetailsId: undefined,
            teamCategoryId: "individu_mix",
            teamCategoryLabel: "Individu (Campuran)",
            quota: "",
            isShow: true,
          },
          {
            categoryDetailsId: undefined,
            teamCategoryId: "male_team",
            teamCategoryLabel: "Beregu Putra",
            quota: "",
            isShow: true,
          },
          {
            categoryDetailsId: undefined,
            teamCategoryId: "female_team",
            teamCategoryLabel: "Beregu Putri",
            quota: "",
            isShow: true,
          },
          {
            categoryDetailsId: undefined,
            teamCategoryId: "mix_team",
            teamCategoryLabel: "Mix Team",
            quota: "",
            isShow: true,
          },
        ],
      },
    ],
  },
];

/* ========================================== */
// util

function computeFormIsEmpty(data) {
  return !data?.length;
}

export { useFormCategories };
