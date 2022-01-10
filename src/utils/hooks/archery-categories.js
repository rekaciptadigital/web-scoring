import * as React from "react";

function useArcheryCategories(serviceFunction, qs) {
  const [categoryTypes, setCategoryTypes] = React.useState({
    status: "idle",
    data: null,
    errors: null,
  });

  const { status, data, errors } = categoryTypes;

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error" && errors;
  const asOptionObject = (type) => ({ value: type.id, label: type.label });
  const options = data?.map(asOptionObject) || [];

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

export { useArcheryCategories };
