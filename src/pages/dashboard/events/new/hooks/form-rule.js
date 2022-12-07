import * as React from "react";
import { useFormRankingSetting } from "../screens/rules/hooks/form-ranking-settings";

function useFormRule({ eventDetail, rankingSettings }) {
  const [submitRule, setSubmitRule] = React.useState(null);
  const [submitRuleFace, setSubmitRuleFace] = React.useState(null);
  const [formPemeringkatan, setFormPemeringkatan] = React.useState(null);

  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const optionsCountingTypes = React.useMemo(
    () => [
      { value: 1, label: "Digabung" },
      { value: 2, label: "Dipisah" },
    ],
    []
  );

  const initialValues = React.useMemo(
    () => _makeFormInitialValues(rankingSettings, { optionsCategories, optionsCountingTypes }),
    [rankingSettings, optionsCategories, optionsCountingTypes]
  );

  const { handleValidation } = useFormRankingSetting(initialValues);

  return {
    submitRule,
    setSubmitRule,
    submitRuleFace,
    setSubmitRuleFace,
    formPemeringkatan,
    setFormPemeringkatan,
    handleValidation
  }

}

function _makeOptionsCategory(categoryDetails) {
  if (!categoryDetails?.length) {
    return [];
  }

  const grouped = _groupCategory(categoryDetails);
  return Object.keys(grouped).map((value) => ({
    value: value,
    label: grouped[value].label,
    data: grouped[value],
  }));
}

function _groupCategory(categoryDetails) {
  if (!categoryDetails?.length) {
    return {};
  }

  const grouped = {};
  for (const category of categoryDetails) {
    const competitionCat = category.competitionCategoryId;
    const classCat = category.ageCategoryId;
    const distanceCat = category.distanceId;
    const key = `${competitionCat.id} - ${classCat.id} - ${distanceCat.id}`;

    if (grouped[key]) {
      continue;
    }

    grouped[key] = {
      label: `${competitionCat.label} - ${classCat.label} - ${distanceCat.label}`,
      competitionCategoryId: competitionCat.id,
      ageCategoryId: classCat.id,
      distanceId: distanceCat.id,
    };
  }

  return grouped;
}

function _makeFormInitialValues(rankingSettings, { optionsCategories, optionsCountingTypes }) {
  if (!rankingSettings) {
    return {
      type: 1,
      rankingName: "",
      categories: [],
      medalCountingType: null,
    };
  }

  return {
    type: rankingSettings.type || 1,
    rankingName: rankingSettings.groupCategoryName || "",
    categories: _checkCategoriesValue(optionsCategories, rankingSettings.listCategory) || [],
    medalCountingType:
      optionsCountingTypes.find((option) => option.value === rankingSettings.rulesRatingClub) ||
      null,
  };
}

function _checkCategoriesValue(optionsCategories, values) {
  const foundCategories = [];
  values.forEach((cat) => {
    const competitionCat = cat.competitionCategoryId;
    const classCat = cat.ageCategoryId;
    const distanceCat = cat.distanceId;
    const value = `${competitionCat} - ${classCat} - ${distanceCat}`;
    const found = optionsCategories.find((option) => option.value === value);
    found && foundCategories.push(found);
  });
  return foundCategories;
}

export { useFormRule };
