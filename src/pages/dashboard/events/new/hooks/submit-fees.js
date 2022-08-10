import { useFetcher } from "utils/hooks/alt-fetcher";
// TODO:
// import { EventsService } from "services";

import { formatServerDate } from "../utils/datetime";

function useSubmitFees() {
  const fetcher = useFetcher();

  const submit = (formFees, eventDetail, { onSuccess: consumerSuccessHandler }) => {
    if (eventDetail?.eventCategories?.length) {
      const payload = makePayloadFees(eventDetail.eventCategories, formFees.data);
      const putFunction = async () => {
        // TODO: pakai service simpan kategori yang beneran
        console.log(payload);
        return { success: true };
      };
      fetcher.runAsync(putFunction, {
        onSuccess: (data) => {
          consumerSuccessHandler?.(data);
        },
      });
    }
  };

  return { ...fetcher, submit };
}

/* ========================================== */

function makePayloadFees(originalCategoryDetails, formData) {
  return {
    categories: originalCategoryDetails.map((originalDetail) => {
      // Prepare data asli tetap disertakan.
      // Overide nilainya untuk yang diedit.
      const categoryDetailEntry = {
        // handle "undefined" sementara sebelum diimplemen di API-nya
        is_show: typeof originalDetail.isShow === "undefined" ? 1 : originalDetail.isShow,
        category_detail_id: originalDetail.categoryDetailsId,
        competition_category_id: originalDetail.competitionCategoryId?.id,
        age_category_id: originalDetail.ageCategoryId?.id,
        distance_category_id: originalDetail.distanceId?.id,
        team_category_id: originalDetail.teamCategoryId?.id,
        quota: originalDetail.quota,
        fee: Number(originalDetail.fee),
        early_bird: Number(originalDetail.earlyBird),
        end_date_early_bird: originalDetail.endDateEarlyBird,
      };

      const teamType = whichTeamType(originalDetail.teamCategoryId.id);
      const normalFeeIsHidden = isHidden(formData.feesByTeam, teamType);
      const earlyBirdIsHidden = isHidden(formData.earlyBirdByTeam, teamType);

      if (normalFeeIsHidden) {
        categoryDetailEntry.is_show = 0;
        categoryDetailEntry.fee = 0;
        categoryDetailEntry.early_bird = 0;
        categoryDetailEntry.end_date_early_bird = null;
      } else {
        // set harga normal
        categoryDetailEntry.fee = formData.isFlatFee
          ? formData.registrationFee
          : getAmountFromFees(formData.feesByTeam, teamType);

        // set early bird
        if (!formData.isEarlyBird || earlyBirdIsHidden) {
          categoryDetailEntry.end_date_early_bird = null;
          categoryDetailEntry.early_bird = 0;
        } else {
          // format tanggal early bird: "2022-03-31"; time-nya nggak perlu?
          categoryDetailEntry.end_date_early_bird = formatServerDate(formData.earlyBirdEndDate);
          categoryDetailEntry.early_bird = formData.isFlatFee
            ? formData.earlyBirdFee
            : getAmountFromFees(formData.earlyBirdByTeam, teamType);
        }
      }

      return categoryDetailEntry;
    }),
  };
}

/* ======================================= */
// utils

function whichTeamType(teamCategoryId) {
  const teamTypes = {
    "individu male": "individu",
    "individu female": "individu",
    male_team: "team",
    female_team: "team",
    mix_team: "mix",
  };
  return teamTypes[teamCategoryId];
}

function isHidden(feesByTeam, selectedTeamType) {
  const feeItem = feesByTeam.find((feeItem) => feeItem.team === selectedTeamType);
  return !feeItem?.isActive;
}

function getAmountFromFees(feesByTeam, selectedTeamType) {
  const feeItem = feesByTeam.find((feeItem) => feeItem.team === selectedTeamType);
  return feeItem?.amount || 0;
}

export { useSubmitFees };
