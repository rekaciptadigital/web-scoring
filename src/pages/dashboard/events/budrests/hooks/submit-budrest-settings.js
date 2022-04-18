import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useSubmitBudrestSettings(formData, eventId) {
  const fetcher = useFetcher();

  const submit = ({ onSuccess: consumerSuccessHandler }) => {
    const postFunction = () => {
      const payload = makePayloadBudrestSettings(formData);
      return BudRestService.postSettingsByEventId(payload, { event_id: eventId });
    };
    fetcher.runAsync(postFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, submit };
}

function makePayloadBudrestSettings(formData) {
  // Yang gak ada partisipan/pendaftarnya gak dimasukkan
  // Di UI-nya disable
  return {
    category_bud_rest: formData
      .filter((setting) => setting.totalParticipant)
      .map((setting) => ({
        category_id: setting.categoryDetailId,
        bud_rest_start: setting.start,
        bud_rest_end: setting.end,
        target_face: setting.targetFace,
        type: setting.type,
      })),
  };
}

export { useSubmitBudrestSettings };
