import * as React from "react";

function useCategoriesWithFilters({ eventCategories, isTeam = false }) {
  const [filterState, dispatch] = React.useReducer(_filtersReducer, {
    competitionCategory: null,
    ageCategories: null,
    genderCategories: null,
    categoryDetails: null,
    paymentStatus: null,
  });

  const {
    competitionCategory: activeCompetitionCategory,
    ageCategories,
    genderCategories,
    categoryDetails,
    paymentStatus,
  } = filterState;

  const activeAgeCategory = ageCategories?.[activeCompetitionCategory];
  const activeGenderCategory = genderCategories?.[activeCompetitionCategory];
  const activeCategoryDetail =
    categoryDetails?.[activeCompetitionCategory]?.[activeAgeCategory]?.[
      activeGenderCategory
    ] || null;
  const activePaymentStatus = paymentStatus?.[activeCompetitionCategory];

  React.useEffect(() => {
    if (!eventCategories) {
      return;
    }
    dispatch({ type: "INIT", payload: eventCategories, isTeam: isTeam });
  }, [eventCategories]);

  const optionsCompetitionCategory = React.useMemo(() => {
    return _makeOptionsCompetitionCategory(
      categoryDetails,
      activeCompetitionCategory
    );
  }, [categoryDetails, activeCompetitionCategory]);

  const optionsAgeCategory = React.useMemo(() => {
    return _makeOptionsAgeCategory(
      categoryDetails,
      activeCompetitionCategory,
      activeAgeCategory
    );
  }, [categoryDetails, activeCompetitionCategory, activeAgeCategory]);

  const optionsGenderCategory = React.useMemo(() => {
    return _makeOptionsGenderCategory(
      categoryDetails,
      activeCompetitionCategory,
      activeAgeCategory,
      activeGenderCategory
    );
  }, [
    categoryDetails,
    activeCompetitionCategory,
    activeAgeCategory,
    activeGenderCategory,
  ]);

  const optionsPaymentStatus = React.useMemo(
    () => _makeOptionsPaymentStatus(activePaymentStatus),
    [activePaymentStatus]
  );

  const selectOptionCompetitionCategory = (competitionCategory) => {
    dispatch({
      type: "UPDATE_COMPETITION_CATEGORY",
      payload: competitionCategory,
    });
  };

  const selectOptionAgeCategory = (ageCategory) => {
    dispatch({ type: "UPDATE_AGE_CATEGORY", payload: ageCategory });
  };

  const selectOptionGenderCategory = (genderCategory) => {
    dispatch({ type: "UPDATE_GENDER_CATEGORY", payload: genderCategory });
  };

  const selectOptionPaymentStatus = (statusId) => {
    dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: statusId });
  };

  return {
    activeCompetitionCategory,
    activeAgeCategory,
    activeGenderCategory,
    activeCategoryDetail,
    activePaymentStatus,
    optionsCompetitionCategory,
    optionsAgeCategory,
    optionsGenderCategory,
    optionsPaymentStatus,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
    selectOptionGenderCategory,
    selectOptionPaymentStatus,
  };
}

function _filtersReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      if (!action.payload) {
        return state;
      }

      const updatedState = _makeFilteringState({
        data: action.payload,
        previousCompetitionCategory: state.competitionCategory,
        previousAgeCategories: state.ageCategories,
        previousGenderCategories: state.genderCategories,
        isTeam: action.isTeam,
      });

      return updatedState;
    }

    case "UPDATE_COMPETITION_CATEGORY": {
      return { ...state, competitionCategory: action.payload };
    }

    case "UPDATE_AGE_CATEGORY": {
      const activeCompetitionCategory = state.competitionCategory;
      return {
        ...state,
        ageCategories: {
          ...state.ageCategories,
          [activeCompetitionCategory]: action.payload,
        },
      };
    }

    case "UPDATE_GENDER_CATEGORY": {
      const activeCompetitionCategory = state.competitionCategory;
      return {
        ...state,
        genderCategories: {
          ...state.genderCategories,
          [activeCompetitionCategory]: action.payload,
        },
      };
    }

    case "UPDATE_PAYMENT_STATUS": {
      const activeCompetitionCategory = state.competitionCategory;
      return {
        ...state,
        paymentStatus: {
          ...state.paymentStatus,
          [activeCompetitionCategory]: action.payload,
        },
      };
    }

    default: {
      return state;
    }
  }
}

/* ================================ */
// utils

function _makeFilteringState({
  data: categoryDetails,
  previousCompetitionCategory = null,
  previousAgeCategories = null,
  previousGenderCategories = null,
  isTeam = false,
}) {
  if (!categoryDetails?.length) {
    return;
  }

  const categoryDetailsSortedByID = categoryDetails.sort(
    (first, then) => first.id - then.id
  );
  const groupedCategories = _runCategoriesGrouping(
    categoryDetailsSortedByID,
    isTeam
  );
  const competitionCategoryKeys = Object.keys(groupedCategories);

  const defaultCompetitionCategory =
    previousCompetitionCategory || competitionCategoryKeys[0];

  const defaultAgeCategories =
    previousAgeCategories ||
    competitionCategoryKeys.reduce((ageCategories, competitionCategory) => {
      const defaultAge = Object.keys(groupedCategories[competitionCategory])[0];
      ageCategories[competitionCategory] = defaultAge;
      return ageCategories;
    }, {});

  const defaultGenderCategories =
    previousGenderCategories ||
    competitionCategoryKeys.reduce(
      (genderCategoriesInGroups, competitionCategory) => {
        const ageCategories = Object.keys(
          groupedCategories[competitionCategory]
        );
        ageCategories.forEach((ageCategory) => {
          const defaultGender = Object.keys(
            groupedCategories[competitionCategory][ageCategory]
          )[0];
          genderCategoriesInGroups[competitionCategory] = defaultGender;
        });
        return genderCategoriesInGroups;
      },
      {}
    );

  const defaultPaymentStatus = { [defaultCompetitionCategory]: 1 };

  return {
    competitionCategory: defaultCompetitionCategory,
    ageCategories: defaultAgeCategories,
    genderCategories: defaultGenderCategories,
    categoryDetails: groupedCategories,
    paymentStatus: defaultPaymentStatus,
  };
}

function _getTeamLabelFromCategoryLabel(labelCategoryDetail) {
  const fragments = labelCategoryDetail.split(" - ");
  const lastIndex = fragments.length - 1;
  return fragments[lastIndex];
}

function _runCategoriesGrouping(categoryDetailsSortedByID, isTeam = false) {
  const categoriesInGroups = categoryDetailsSortedByID.reduce(
    (groupingResult, categoryDetail) => {
      if (!categoryDetail.isShow) {
        return groupingResult;
      }

      const competitionCategoryId = categoryDetail.competitionCategoryId;
      const classCategory = categoryDetail.classCategory;
      const genderCategory = categoryDetail.teamCategoryId;

      const isIndividualCategory =
        ["individu male", "individu female"].indexOf(genderCategory) > -1;
      const isTeamCategory =
        ["male_team", "female_team", "mix_team"].indexOf(genderCategory) > -1;

      if ((!isTeam && isTeamCategory) || (isTeam && isIndividualCategory)) {
        return groupingResult;
      }

      if (!groupingResult[competitionCategoryId]) {
        groupingResult[competitionCategoryId] = {};
      }

      if (!groupingResult[competitionCategoryId][classCategory]) {
        groupingResult[competitionCategoryId][classCategory] = {};
      }

      groupingResult[competitionCategoryId][classCategory][genderCategory] = {
        originalCategoryDetail: categoryDetail,
        categoryDetailId: categoryDetail.id,
        teamCategoryLabel: _getTeamLabelFromCategoryLabel(
          categoryDetail.labelCategory
        ),
        quota: categoryDetail.quota,
        totalParticipant: categoryDetail.totalParticipant,
        remainingQuota: categoryDetail.quota - categoryDetail.totalParticipant,
        defaultEliminationCount:
          categoryDetail.defaultEliminationCount || undefined,
        eliminationLock: categoryDetail.eliminationLock,
      };

      return groupingResult;
    },
    {}
  );

  return categoriesInGroups;
}

function _makeOptionsCompetitionCategory(
  groupedCategoryDetails,
  activeCompetitionCategory
) {
  if (
    !groupedCategoryDetails ||
    Object.keys(groupedCategoryDetails).length === 0
  ) {
    return [];
  }
  return Object.keys(groupedCategoryDetails).map((competitionCategoryId) => ({
    competitionCategory: competitionCategoryId,
    isActive: competitionCategoryId === activeCompetitionCategory,
  }));
}

function _makeOptionsAgeCategory(
  groupedCategoryDetails,
  activeCompetitionCategory,
  activeAgeCategory
) {
  if (
    !groupedCategoryDetails ||
    Object.keys(groupedCategoryDetails).length === 0
  ) {
    return [];
  }
  return Object.keys(groupedCategoryDetails[activeCompetitionCategory]).map(
    (ageCategoryId) => ({
      ageCategory: ageCategoryId,
      isActive: ageCategoryId === activeAgeCategory,
    })
  );
}

function _makeOptionsGenderCategory(
  groupedCategoryDetails,
  activeCompetitionCategory,
  activeAgeCategory,
  activeGenderCategory
) {
  if (
    !groupedCategoryDetails ||
    Object.keys(groupedCategoryDetails).length === 0
  ) {
    return [];
  }
  return Object.keys(
    groupedCategoryDetails[activeCompetitionCategory][activeAgeCategory]
  ).map((teamCategoryId) => {
    const labels = {
      "individu male": "Individu Putra",
      "individu female": "Individu Putri",
      individu_mix: "Individu",
      male_team: "Beregu Putra",
      female_team: "Beregu Putri",
      mix_team: "Beregu Campuran",
    };

    return {
      genderCategory: teamCategoryId,
      genderCategoryLabel: labels[teamCategoryId],
      isActive: teamCategoryId === activeGenderCategory,
    };
  });
}

function _makeOptionsPaymentStatus(activePaymentStatus = 1) {
  const defaultOptions = [
    { status: 1, label: "Lunas" },
    { status: 4, label: "Belum Lunas" },
    { status: 2, label: "Expired" },
    { status: 3, label: "Gagal" },
    { status: 5, label: "Refund" },
    { status: 0, label: "Semua" },
  ];
  return defaultOptions.map((payment) => ({
    ...payment,
    isActive: payment.status === activePaymentStatus,
  }));
}

export { useCategoriesWithFilters };
