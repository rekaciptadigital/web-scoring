import * as React from "react";
import { getClassDescription } from "pages/dashboard/class-categories/utils";

function useArcheryCategories(serviceFunction, qs = null) {
  const [categoryTypes, setCategoryTypes] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });

  const { status, data, errors } = categoryTypes;

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error" && errors;
  const asOptionObject = (type) => ({
    value: type.id,
    label: type.label,
    description: _getDescriptionValue(type),
  });
  const options = React.useMemo(() => data?.map(asOptionObject) || [], [data]);

  React.useEffect(() => {
    const fetch = async () => {
      setCategoryTypes((state) => ({ ...state, status: "loading", errors: null }));
      const result = await serviceFunction(qs);
      if (result.success) {
        setCategoryTypes((state) => ({ ...state, status: "success", data: result.data }));
      } else {
        setCategoryTypes((state) => ({ ...state, status: "error", errors: result.errors }));
      }
    };
    fetch();
  }, [serviceFunction, qs]);

  return { options, isLoading, isSuccess, isError, errors };
}

function _getDescriptionValue(typeData) {
  const classCategory = {
    label: typeData.label,
    isAge: typeData.isAge,
    minAge: typeData.minAge,
    maxAge: typeData.maxAge,
    minDateOfBirth: typeData.minDateOfBirth,
    maxDateOfBirth: typeData.maxDateOfBirth,
  };
  return getClassDescription(classCategory);
}

export { useArcheryCategories };
