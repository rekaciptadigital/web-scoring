import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { formatServerDate } from "../utils/datetime";

function useSubmitCategories() {
  const fetcher = useFetcher();

  const submit = async (
    formData,
    formFees,
    { eventId, onSuccess: consumerSuccessHandler }
  ) => {
    const payload = makePayloadCategories(formData, formFees, eventId);
    const fetchingFunction = () => EventsService.storeCategoryDetailV2(payload);

    fetcher.runAsync(fetchingFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  const deleteByCompetitionCategory = async (
    category,
    { eventId, onSuccess: consumerSuccessHandler }
  ) => {
    const ids = [];
    category.categoryDetails.forEach((detail) => {
      detail.quotas.forEach((quota) => {
        ids.push(quota.categoryDetailsId);
      });
    });
    const payload = {
      event_id: eventId,
      category_ids: ids.filter((id) => Boolean(id)),
    };
    const fetchingFunction = () =>
      EventsService.deleteCategoryDetailV2(payload);
    fetcher.runAsync(fetchingFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  const deleteByCategoryClass = async (
    detail,
    { eventId, onSuccess: consumerSuccessHandler }
  ) => {
    const ids = [];
    detail.quotas.forEach((quota) => {
      ids.push(quota.categoryDetailsId);
    });
    const payload = {
      event_id: eventId,
      category_ids: ids.filter((id) => Boolean(id)),
    };
    const fetchingFunction = () =>
      EventsService.deleteCategoryDetailV2(payload);
    fetcher.runAsync(fetchingFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return {
    ...fetcher,
    submit,
    deleteByCompetitionCategory,
    deleteByCategoryClass,
  };
}

function makePayloadCategories(formData, formFees, eventId) {
  const flatCategories = [];
  formData.forEach((category) => {
    category.categoryDetails.forEach((detail) => {
      let ageCategoryId = !detail.ageCategoryId
        ? ""
        : detail.ageCategoryId.value;
      let distanceId = !detail.distanceId ? "" : detail.distanceId.value;
      detail.quotas.forEach((quota) => {
        const teamName = getTeam(quota.teamCategoryId);
        const normalFeeItem = formFees.data.feesByTeam.find(
          (feeItem) => feeItem.team === teamName
        );
        const earlyBirdFeeItem = formFees.data.earlyBirdByTeam.find(
          (feeItem) => feeItem.team === teamName
        );

        if (!quota.categoryDetailsId && !normalFeeItem.isActive) {
          return;
        }

        const categoryDetailEntry = {
          category_id: quota.categoryDetailsId,
          team_category_id: quota.teamCategoryId,
          competition_category_id: category.competitionCategoryId.value,
          age_category_id: ageCategoryId,
          distance_category_id: distanceId,
          is_show: normalFeeItem.isActive ? 1 : 0,
          quota: normalFeeItem.isActive ? quota.quota || 0 : 0,
          fee: normalFeeItem.isActive ? normalFeeItem.amount || 0 : 0,
          early_bird: earlyBirdFeeItem.isActive
            ? earlyBirdFeeItem.amount || 0
            : 0,
          end_date_early_bird: earlyBirdFeeItem.isActive
            ? formatServerDate(formFees.data.earlyBirdEndDate)
            : null,
        };
        flatCategories.push(categoryDetailEntry);
      });
    });
  });

  return {
    include_payment_gateway_fee_to_user:
      formFees.data.includePaymentGatewayFeeToUser,
    event_id: eventId,
    categories: flatCategories,
  };
}

const getTeam = (teamCategoryId) => {
  const teamByIds = {
    "individu male": "individu",
    "individu female": "individu",
    individu_mix: "individu_mix",
    male_team: "team",
    female_team: "team",
    mix_team: "mix",
  };
  return teamByIds[teamCategoryId];
};

export { useSubmitCategories };
