import * as React from "react";

function useFormRankingSetting(
  initialValues = {
    type: 1,
    rankingName: "",
    categories: [],
    medalCountingType: null,
  }
) {
  const reservedInitialValues = React.useRef({ [initialValues.type]: initialValues });
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      if (action.type === "INIT") {
        return { ...state, data: action.payload, errors: {} };
      }

      if (action.type === "CHANGE_FIELD") {
        return { ...state, data: { ...state.data, [action.field]: action.payload } };
      }

      if (action.type === "CHANGE_RANKING_TYPE") {
        // 1. reset error
        // 2. kembalikan ke data ketika masih "clean"
        return {
          ...state,
          errors: {},
          data: {
            ...state.data,
            type: action.payload,
            rankingName: reservedInitialValues.current[action.payload]?.rankingName || "",
            categories: reservedInitialValues.current[action.payload]?.categories || [],
            medalCountingType:
              reservedInitialValues.current[action.payload]?.medalCountingType || null,
          },
        };
      }

      if (action.type === "UPDATE_ERRORS") {
        return { ...state, errors: action.payload };
      }

      return state;
    },
    {
      data: initialValues,
      errors: {},
    }
  );

  React.useEffect(() => {
    if (!initialValues) {
      return;
    }
    reservedInitialValues.current = { [initialValues.type]: initialValues };
    dispatch({ type: "INIT", payload: initialValues });
  }, [initialValues]);

  const isDirty = React.useMemo(
    () => _checkFormDirty(reservedInitialValues.current, state.data),
    [state.data]
  );

  const isValid = React.useMemo(() => !Object.keys(state.errors).length, [state.errors]);
  const isInvalid = !isValid;

  const updateField = (field, value) => {
    handleChange(field, () => {
      dispatch({ type: "CHANGE_FIELD", field: field, payload: value });
    });
  };

  const setType = (value) => {
    reservedInitialValues.current = {
      ...reservedInitialValues.current,
      [value]: {
        type: value === 1 ? "" : value,
        rankingName: reservedInitialValues.current[value]?.rankingName || "",
        categories: reservedInitialValues.current[value]?.categories || [],
        medalCountingType: reservedInitialValues.current[value]?.medalCountingType || null,
      },
    };
    dispatch({ type: "CHANGE_RANKING_TYPE", payload: value });
  };

  const handleValidation = ({ onValid, onInvalid }) => {
    const errors = _validateFields(state.data);
    const isValid = !Object.keys(errors).length;
    dispatch({ type: "UPDATE_ERRORS", payload: errors });
    if (isValid) {
      onValid?.(state.data);
    } else {
      onInvalid?.(errors);
    }
  };

  const handleChange = (field, handler) => {
    const currentError = state.errors[field];
    if (currentError?.length) {
      const updatedErrors = { ...state.errors };
      delete updatedErrors[field];
      dispatch({ type: "UPDATE_ERRORS", payload: updatedErrors });
    }
    handler?.(currentError);
  };

  return {
    data: state.data,
    errors: state.errors,
    isValid,
    isInvalid,
    updateField,
    setType,
    isDirty,
    handleValidation,
    handleChange,
  };
}

function _checkFormDirty(initialValues, data) {
  const initialValuesByType = initialValues[data.type];
  if (!initialValuesByType) {
    return false;
  }

  if (data.type === 1 && initialValuesByType.type !== data.type) {
    return true;
  }

  if (initialValuesByType.rankingName !== data.rankingName) {
    return true;
  }

  if (initialValuesByType.medalCountingType?.value !== data.medalCountingType?.value) {
    return true;
  }

  if (initialValuesByType.categories.length !== data.categories.length) {
    return true;
  }

  const sortedCategoriesInitial = initialValuesByType.categories.map((c) => c.value).sort();
  const sortedCategories = data.categories.map((c) => c.value).sort();
  if (sortedCategories.some((value, index) => value !== sortedCategoriesInitial[index])) {
    return true;
  }

  return false;
}
/**
 * Rule validasi berdasarkan tipenya. Khusus tipe pemeringkatan 1 (semua kategori),
 * form gak divalidasi karena nanti data yang dibaca cuman field tipenya aja, field
 * yang lain diabaikan.
 */
function _validateFields(formData) {
  const errors = {};

  switch (formData.type) {
    case 1: {
      return errors;
    }

    case 2: {
      const CATEGORIES = "categories";
      const COUNTING_TYPE = "medalCountingType";

      if (!formData[CATEGORIES]?.length) {
        errors[CATEGORIES] = _addErrorMessage(
          errors[CATEGORIES],
          "Kategori wajib dipilih untuk dikelompokkan"
        );
      }

      if (!formData[COUNTING_TYPE]) {
        errors[COUNTING_TYPE] = _addErrorMessage(
          errors[COUNTING_TYPE],
          "Jenis perhitungan medali wajib diisi"
        );
      }

      return errors;
    }

    case 3: {
      const RANKING_NAME = "rankingName";
      const CATEGORIES = "categories";
      const COUNTING_TYPE = "medalCountingType";

      if (!formData[RANKING_NAME]) {
        errors[RANKING_NAME] = _addErrorMessage(
          errors[RANKING_NAME],
          "Penamaan pemeringkatan wajib diisi"
        );
      }

      if (!formData[CATEGORIES]?.length) {
        errors[CATEGORIES] = _addErrorMessage(
          errors[CATEGORIES],
          "Kategori wajib dipilih untuk dikelompokkan"
        );
      }

      if (!formData[COUNTING_TYPE]) {
        errors[COUNTING_TYPE] = _addErrorMessage(
          errors[COUNTING_TYPE],
          "Jenis perhitungan medali wajib diisi"
        );
      }

      return errors;
    }

    default: {
      return errors;
    }
  }
}

function _addErrorMessage(existingMessages, newMessage) {
  existingMessages = existingMessages || [];
  existingMessages.push(newMessage);
  return existingMessages;
}

export { useFormRankingSetting };
