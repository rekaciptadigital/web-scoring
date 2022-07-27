import { datetime } from "utils";

function parseAgeCategoryResponseData(payload) {
  const isUsia = [
    payload.minAge,
    payload.maxAge,
    payload.minDateOfBirth,
    payload.maxDateOfBirth,
  ].some((value) => Boolean(value));

  if (!isUsia) {
    return {
      label: payload.label,
      criteria: 1,
    };
  }

  const asDate = !payload.isAge;
  const ageValidator = _getAgeValidatorValue(asDate, payload);
  const min = _getMinValue(asDate, payload);
  const max = _getMaxValue(asDate, payload);

  return {
    label: payload.label,
    criteria: 2,
    ageValidator: ageValidator,
    asDate: asDate,
    min: min,
    max: max,
  };
}

function _getAgeValidatorValue(asDate, payload) {
  if (asDate) {
    return _checkAgeValidatorByPattern(payload.minDateOfBirth, payload.maxDateOfBirth);
  }
  return _checkAgeValidatorByPattern(payload.minAge, payload.maxAge);
}

function _checkAgeValidatorByPattern(min, max) {
  const matrix = [min, max];
  const isMin = matrix[0] && !matrix[1];
  const isMax = !matrix[0] && matrix[1];
  const isRange = matrix[0] && matrix[1];

  if (isMin) {
    return "min";
  }
  if (isMax) {
    return "max";
  }
  if (isRange) {
    return "range";
  }
}

function _getMinValue(asDate, payload) {
  if (asDate) {
    return payload.minDateOfBirth ? datetime.parseServerDatetime(payload.minDateOfBirth) : null;
  }
  return payload.minAge || null;
}

function _getMaxValue(asDate, payload) {
  if (asDate) {
    return payload.maxDateOfBirth ? datetime.parseServerDatetime(payload.maxDateOfBirth) : null;
  }
  return payload.maxAge || null;
}

export { parseAgeCategoryResponseData };
