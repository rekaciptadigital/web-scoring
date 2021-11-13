import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";
import { validators, getValidatorByField } from "utils/form-wizard-validation";

function useFieldValidation(fieldName) {
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();

  const handleFieldValidation = (value) => {
    if (!fieldName) return;

    const validate = validators[fieldName] || getValidatorByField(fieldName);
    if (!validate) return;

    const error = validate(value);
    const updatedErrors = { ...errors };
    if (error) {
      updatedErrors[fieldName] = [error];
    } else {
      delete updatedErrors[fieldName];
    }
    dispatch(EventsStore.errors(updatedErrors));
  };

  return { errors, handleFieldValidation };
}

export { useFieldValidation };
