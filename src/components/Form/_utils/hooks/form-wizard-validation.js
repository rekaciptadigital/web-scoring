import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";

function useFormWizardValidation({ data, currentStep, validate, onValid }) {
  const [isValidating, setIsValidating] = React.useState(false);
  const [registeredFields, setRegisteredFields] = React.useState({});
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isValidating) return;

    const fieldsErrors = validateCurrentStep(data, currentStep, validate, registeredFields);
    if (!Object.keys(fieldsErrors).length) {
      onValid();
    }
    dispatch(EventsStore.errors(fieldsErrors));
    setIsValidating(false);
  }, [isValidating, registeredFields, currentStep, data, onValid]);

  const runValidation = () => {
    setIsValidating(true);
  };

  const registerField = (fieldName) => {
    setRegisteredFields((fields) => {
      if (fields[currentStep]?.includes(fieldName)) {
        return fields;
      }

      const updatedFields = { ...fields };
      updatedFields[currentStep] = fields[currentStep]
        ? [...fields[currentStep], fieldName]
        : [fieldName];
      return updatedFields;
    });
  };

  const context = { validate, currentStep, registerField };

  return { errors, runValidation, context };
}

function validateCurrentStep(data, step, validate, registeredFields) {
  const errors = {};

  if (!registeredFields[step]) {
    return errors;
  }

  const fieldsCurrentStep = registeredFields[step];
  for (let field of fieldsCurrentStep) {
    let value;

    // Men-handle 2 jenis field name:
    // 1. flat -> "eventName"
    // 2. nested -> "registrationFees.0.price" -> field yang datanya di formData nested di dalam array maupun objek
    const nestedKeys = field.split(".");
    if (nestedKeys.length > 1) {
      value = data;
      for (let currentKey of nestedKeys) {
        value = value[currentKey];
      }
    } else {
      const dataField = nestedKeys[0];
      value = data[dataField];
    }

    const error = validate[field]?.(value);
    if (error) {
      errors[field] = [error];
    }
  }

  return errors;
}

export { useFormWizardValidation };
