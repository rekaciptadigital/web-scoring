import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as EventsStore from "store/slice/events";
import { useFormWizardContext } from "../context/wizard";

function useFieldValidation(fieldName) {
  const { validate, registerField } = useFormWizardContext();
  const { errors } = useSelector(EventsStore.getEventsStore);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!fieldName) {
      return;
    }
    // register field ke list fields menurut nomor step di form wizard
    registerField(fieldName);
  }, [fieldName, registerField]);

  return {
    errors,
    runFieldValidation: (value) => {
      if (!validate[fieldName]) {
        return;
      }
      const error = validate[fieldName](value);
      const updatedErrors = { ...errors };
      if (error) {
        updatedErrors[fieldName] = [error];
      } else {
        delete updatedErrors[fieldName];
      }
      dispatch(EventsStore.errors(updatedErrors));
    },
  };
}

export { useFieldValidation };
