import { validators, getValidatorByField } from ".";

const validateFieldsByStep = (config) => {
  const { formData, activeTab, dispatchErrors, onValid } = config;
  let validationErrors = {};

  if (activeTab === 1) {
    const fieldsList = ["poster", "eventName", "location", "locationType", "city"];
    validationErrors = validateInBulk(formData, fieldsList);
  } else if (activeTab === 2) {
    const fieldsList = ["teamCategories"];
    validationErrors = validateInBulk(formData, fieldsList);

    for (let i = 0; i < formData.registrationFees.length; i++) {
      const fieldsList = [`registrationFees.${i}.price`];
      validationErrors = {
        ...validationErrors,
        ...validateInBulk(formData, fieldsList),
      };

      for (let j = 0; j < formData.registrationFees[i].categoryPrices.length; j++) {
        const fieldsList = [`registrationFees.${i}.categoryPrices.${j}.price`];
        validationErrors = {
          ...validationErrors,
          ...validateInBulk(formData, fieldsList),
        };
      }
    }
  } else if (activeTab === 3) {
    const fieldsList = [
      "registrationStartDatetime",
      "registrationEndDatetime",
      "eventStartDatetime",
      "eventEndDatetime",
      "qualificationStartDatetime",
      "qualificationEndDatetime",
      "qualificationSessionLength",
    ];
    validationErrors = validateInBulk(formData, fieldsList);
  } else if (activeTab === 4) {
    // Nested, array dynamic fields wkwk
    for (let i = 0; i < formData.eventCategories.length; i++) {
      const fieldsList = [
        `eventCategories.${i}.ageCategory`,
        `eventCategories.${i}.maxDateOfBirth`,
      ];
      validationErrors = {
        ...validationErrors,
        ...validateInBulk(formData, fieldsList),
      };

      for (let j = 0; j < formData.eventCategories[i].competitionCategories.length; j++) {
        const fieldsList = [
          `eventCategories.${i}.competitionCategories.${j}.competitionCategory`,
          `eventCategories.${i}.competitionCategories.${j}.distancesDisplay`,
        ];
        validationErrors = {
          ...validationErrors,
          ...validateInBulk(formData, fieldsList),
        };
      }
    }
  }
  dispatchErrors(validationErrors);
  if (!Object.keys(validationErrors).length) {
    onValid();
  }
};

const getValueByFieldName = (data, fieldName) => {
  const fieldKeys = fieldName.split(".");
  if (fieldKeys.length <= 1) {
    return data[fieldName];
  }
  let valueFound = data;
  for (let key of fieldKeys) {
    key = key === "distancesDisplay" ? "distances" : key;
    valueFound = valueFound[key];
  }
  return valueFound;
};

const validateInBulk = (data, fieldsList) => {
  const validationErrors = {};
  for (let field of fieldsList) {
    const validate = validators[field] || getValidatorByField(field);
    if (!validate) continue;

    const value = getValueByFieldName(data, field);
    const error = validate(value, data);
    if (error) {
      validationErrors[field] = [error];
    }
  }
  return validationErrors;
};

export { validateFieldsByStep };
