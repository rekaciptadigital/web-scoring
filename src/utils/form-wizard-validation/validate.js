import { validators, getValidatorByField } from ".";

const validateFieldsByStep = (config) => {
  const { formData, activeTab, dispatchErrors, onValid } = config;
  let validationErrors = {};

  if (activeTab === 1) {
    const fieldsList = [
      "poster",
      "eventName",
      "location",
      "locationType",
      "city",
      "picCallCenter",
      "description",
    ];
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

      if (!formData.registrationFees[i].categoryPrices) {
        continue;
      }

      for (let j = 0; j < formData.registrationFees[i].categoryPrices.length; j++) {
        const fieldsList = [`registrationFees.${i}.categoryPrices.${j}.price`];
        validationErrors = {
          ...validationErrors,
          ...validateInBulk(formData, fieldsList),
        };
      }
    }
  } else if (activeTab === 3) {
    let fieldsList = [
      "registrationStartDatetime",
      "registrationEndDatetime",
      "eventStartDatetime",
      "eventEndDatetime",
    ];
    // Field-field berikut cuma dicek di event marathon, di full-day skip
    if (formData.eventType === "marathon") {
      fieldsList = [
        ...fieldsList,
        "qualificationStartDatetime",
        "qualificationEndDatetime",
        "qualificationSessionLength",
        "qualificationDaysDetails",
      ];
    }
    validationErrors = validateInBulk(formData, fieldsList);
  } else if (activeTab === 4) {
    // Nested, dynamic array fields wkwk
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
  } else if (activeTab === 5) {
    const fieldsList = ["targets", "publishDatetime"];
    validationErrors = validateInBulk(formData, fieldsList);
  }

  // Status "valid" diwakili dengan data Objek kosongan...
  // `undefined` juga valid, tapi harus diubah dulu jadi -> `{}`
  validationErrors = validationErrors ? validationErrors : {};
  dispatchErrors(validationErrors);
  if (!validationErrors || !Object.keys(validationErrors).length) {
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
