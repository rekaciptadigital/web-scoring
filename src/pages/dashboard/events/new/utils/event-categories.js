import { stringUtil } from "utils";

function makeStateCategories(eventCategories) {
  const groupedCategories = {};
  eventCategories.forEach((category) => {
    if (!groupedCategories[category.competitionCategoryId.id]) {
      groupedCategories[category.competitionCategoryId.id] = {};
    }
    if (!groupedCategories[category.competitionCategoryId.id][category.ageCategoryId.id]) {
      groupedCategories[category.competitionCategoryId.id][category.ageCategoryId.id] = [];
    }
    groupedCategories[category.competitionCategoryId.id][category.ageCategoryId.id].push({
      label: category.label,
      categoryDetailsId: category.categoryDetailsId,
      ageCategoryId: category.ageCategoryId,
      distanceId: category.distanceId,
      teamCategoryId: category.teamCategoryId,
      quota: category.quota,
      isShow: Boolean(category.isShow),
    });
  });

  const flattened = Object.keys(groupedCategories).map((competitionGroup) => {
    return {
      key: stringUtil.createRandom(),
      isAlive: true,
      competitionCategoryId: { value: competitionGroup, label: competitionGroup },
      categoryDetails: Object.keys(groupedCategories[competitionGroup]).map((ageGroup) => {
        const categoryData = {
          key: stringUtil.createRandom(),
          isAlive: true,
          ageCategoryId: {
            value: groupedCategories[competitionGroup][ageGroup][0].ageCategoryId.id,
            label: groupedCategories[competitionGroup][ageGroup][0].ageCategoryId.label,
          },
          distanceId: {
            value: groupedCategories[competitionGroup][ageGroup][0].distanceId.id,
            label: groupedCategories[competitionGroup][ageGroup][0].distanceId.label,
          },
          quotas: groupedCategories[competitionGroup][ageGroup].map((detail) => ({
            categoryDetailsId: detail.categoryDetailsId,
            teamCategoryId: detail.teamCategoryId.id,
            teamCategoryLabel: detail.teamCategoryId.label,
            quota: detail.quota,
            isShow: detail.isShow,
          })),
        };

        const sortedQuotaData = sortQuotasByTeams(categoryData.quotas);
        categoryData.quotas = fillEmptyQuotaSlot(sortedQuotaData);
        return categoryData;
      }),
    };
  });
  return flattened;
}

/* ========================================= */

function sortQuotasByTeams(quotaData) {
  const SORTED_TEAM_IDS = [
    "individu male",
    "individu female",
    "male_team",
    "female_team",
    "mix_team",
  ];

  const sortedQuotaItems = SORTED_TEAM_IDS.map((teamId) =>
    quotaData.find((quota) => teamId === quota.teamCategoryId)
  ).filter((quota) => typeof quota !== "undefined");

  return sortedQuotaItems;
}

function fillEmptyQuotaSlot(sortedQuotaItems) {
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
