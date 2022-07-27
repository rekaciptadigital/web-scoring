import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";

function useAgeCategoryDetail(ageCategoryId) {
  const fetcher = useFetcher();

  const fetchAgeCategory = () => {
    const getFunction = () => CategoryService.getMasterAgeCategoryById(ageCategoryId);
    return fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    fetchAgeCategory();
  }, []);

  return { ...fetcher, fetchAgeCategory };
}

export { useAgeCategoryDetail };
