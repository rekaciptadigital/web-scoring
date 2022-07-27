import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";
import { startOfDay } from "date-fns";
import { datetime } from "utils";

import { CRITERIA_UMUM, CRITERIA_USIA } from "../constants";

function useSubmitUpdateAgeCategory(form) {
  const fetcher = useFetcher();

  const submit = (ageCategoryId, options) => {
    const payload = _makePayload(ageCategoryId, form);
    const putFunction = () => CategoryService.updateMasterAgeCategory(payload);
    return fetcher.runAsync(putFunction, options);
  };

  return { ...fetcher, submit };
}

function _makePayload(ageCategoryId, form) {
  const criteria = { 1: CRITERIA_UMUM, 2: CRITERIA_USIA };

  const payload = {
    id: ageCategoryId,
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

export { useSubmitUpdateAgeCategory };
