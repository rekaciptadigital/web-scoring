import { stringUtil } from "utils";

function makeStateCategories(eventCategories) {
  const groupedCategories = _runNestedGroupBy(eventCategories);
  const uiState = _makeFormUiState(groupedCategories);
  return uiState;
}

/**
 * Bikin kategori yang di-group secara "multiple nested".
 * Untuk mempermudah konstruksi data state form yang lumayan rumit.
 *
 * Struktur object grouping:
 * {
 *   [competitionCategoryId]: {
 *     [ageCategoryId + "-" + distanceCategoryId]: {
 *       label,
 *       categoryDetailsId,
 *       ageCategoryId,
 *       distanceId,
 *       teamCategoryId,
 *       quota,
 *       isShow,
 *     }
 *   }
 * }
 */
function _runNestedGroupBy(categoryDetails) {
  const groupedCategories = {};

  categoryDetails.forEach((category) => {
    const categoryDetail = {
      label: category.label,
      categoryDetailsId: category.categoryDetailsId,
      ageCategoryId: category.ageCategoryId,
      distanceId: category.distanceId,
      teamCategoryId: category.teamCategoryId,
      quota: category.quota,
      isShow: Boolean(category.isShow),
    };

    const competitionCategoryId = category.competitionCategoryId.id;
    const ageCategoryId = category.ageCategoryId.id;
    const distanceId = category.distanceId.id;
    const ageDistanceIdPair = ageCategoryId + "-" + distanceId;

    if (!groupedCategories[competitionCategoryId]) {
      groupedCategories[competitionCategoryId] = {};
    }
    if (!groupedCategories[competitionCategoryId][ageDistanceIdPair]) {
      groupedCategories[competitionCategoryId][ageDistanceIdPair] = [];
    }

    groupedCategories[competitionCategoryId][ageDistanceIdPair].push(categoryDetail);
  });

  return groupedCategories;
}

function _makeFormUiState(groupedCategories) {
  const competitionCategoryIds = Object.keys(groupedCategories);

  const uiStateData = competitionCategoryIds.map((competitionCategoryId) => {
    const parentState = {
      key: stringUtil.createRandom(),
      isAlive: true,
      competitionCategoryId: {
        value: competitionCategoryId,
        label: competitionCategoryId,
      },
      categoryDetails: [],
    };

    const categoryDetailsByAgeDistanceId = groupedCategories[competitionCategoryId];
    const ageDistanceIdPairs = Object.keys(categoryDetailsByAgeDistanceId);

    const childrenDetailGroups = ageDistanceIdPairs.map((ageDistanceIdPair) => {
      const categoryDetails = categoryDetailsByAgeDistanceId[ageDistanceIdPair];
      const commonCategory = categoryDetails[0];

      const detailGroupsStateData = {
        key: stringUtil.createRandom(),
        isAlive: true,
        ageCategoryId: {
          value: commonCategory.ageCategoryId.id,
          label: commonCategory.ageCategoryId.label,
        },
        distanceId: {
          value: commonCategory.distanceId.id,
          label: commonCategory.distanceId.label,
        },
        quotas: categoryDetails.map((detail) => ({
          categoryDetailsId: detail.categoryDetailsId,
          teamCategoryId: detail.teamCategoryId.id,
          teamCategoryLabel: detail.teamCategoryId.label,
          quota: detail.quota,
          isShow: detail.isShow,
        })),
      };

      const sortedQuotaData = _sortQuotaByTeam(detailGroupsStateData.quotas);

      return {
        ...detailGroupsStateData,
        quotas: _fillEmptyQuotaSlot(sortedQuotaData),
      };
    });

    return {
      ...parentState,
      categoryDetails: childrenDetailGroups,
    };
  });

  return uiStateData;
}

function _sortQuotaByTeam(quotaData) {
  const SORTED_TEAM_IDS = [
    "individu male",
    "individu female",
    "individu_mix",
    "male_team",
    "female_team",
    "mix_team",
  ];

  const sortedQuotaItems = SORTED_TEAM_IDS.map((teamId) =>
    quotaData.find((quota) => teamId === quota.teamCategoryId)
  );

  return sortedQuotaItems;
}

function _fillEmptyQuotaSlot(sortedQuotaItems) {
  return defaultQuotasData.map((quota, index) => {
    if (quota.teamCategoryId === sortedQuotaItems[index]?.teamCategoryId) {
      return sortedQuotaItems[index];
    }
    return quota;
  });
}

const defaultQuotasData = [
  {
    categoryDetailsId: undefined,
    teamCategoryId: "individu male",
    teamCategoryLabel: "Individu Putra",
    quota: "",
  },
  {
    categoryDetailsId: undefined,
    teamCategoryId: "individu female",
    teamCategoryLabel: "Individu Putri",
    quota: "",
  },
  {
    categoryDetailsId: undefined,
    teamCategoryId: "individu_mix",
    teamCategoryLabel: "Individu (Campuran)",
    quota: "",
  },
  {
    categoryDetailsId: undefined,
    teamCategoryId: "male_team",
    teamCategoryLabel: "Beregu Putra",
    quota: "",
  },
  {
    categoryDetailsId: undefined,
    teamCategoryId: "female_team",
    teamCategoryLabel: "Beregu Putri",
    quota: "",
  },
  {
    categoryDetailsId: undefined,
    teamCategoryId: "mix_team",
    teamCategoryLabel: "Mix Team",
    quota: "",
  },
];

export { makeStateCategories };
