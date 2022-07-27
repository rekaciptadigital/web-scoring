import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";
import { startOfDay } from "date-fns";
import { datetime } from "utils";

const CRITERIA_UMUM = "umum";
const CRITERIA_USIA = "usia";

function useSubmitAgeCategory(form) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const payload = _makePayload(form);
    const postFunction = () => CategoryService.createMasterAgeCategory(payload);
    return fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

function _makePayload(form) {
  const criteria = { 1: CRITERIA_UMUM, 2: CRITERIA_USIA };

  const payload = {
    label: form.label,
    type: criteria[form.criteria],
  };

  if (criteria[form.criteria] === CRITERIA_UMUM) {
    return payload;
  }

  payload.isAge = 1;
  payload.min = form.min || 0;
  payload.max = form.max || 0;

  if (form.asDate) {
    payload.isAge = 0;
    payload.min = _getDatetime(form.min);
    payload.max = _getDatetime(form.max);

    return payload;
  }

  return payload;
}

function _getDatetime(date) {
  if (!date) {
    return 0;
  }
  const dateAtStart = startOfDay(date);
  return datetime.formatServerDatetime(dateAtStart);
}

export { useSubmitAgeCategory };
