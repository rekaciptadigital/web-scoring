// import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitScore(qualificationCode, scoringDetail) {
  const fetcher = useFetcher();

  const submitScore = async ({ rambahan, shotIndex, value, onSuccess: consumerSuccessHandler }) => {
    if (!scoringDetail) {
      return;
    }

    const payload = {
      save_permanent: 1,
      code: qualificationCode,
      shoot_scores: _makePayload({
        scoringDetail,
        rambahan,
        shotIndex,
        updatedScore: value,
      }),
    };

    const postFunction = () => {
      return ScoringService.saveParticipantScore(payload);
    };

    fetcher.runAsync(postFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, submitScore };
}

function _makePayload({ scoringDetail, rambahan, shotIndex, updatedScore }) {
  const payload = {
    ...scoringDetail,
    [rambahan]: scoringDetail[rambahan].map((previousScore, index) =>
      index === shotIndex ? updatedScore : previousScore
    ),
  };
  return payload;
}

export { useSubmitScore };
